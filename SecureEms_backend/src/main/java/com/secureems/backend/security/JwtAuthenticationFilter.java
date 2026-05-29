package com.secureems.backend.security;

import com.secureems.backend.entity.Employee;
import com.secureems.backend.repository.EmployeeRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final EmployeeRepository employeeRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Extract the Authorization Header from the incoming React request
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // 2. Check if the header contains a valid Bearer Token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
            } catch (Exception e) {
                logger.error("JWT Token extraction failed: " + e.getMessage());
            }
        }

        // 3. If an email was found and the request is not already authenticated in this loop
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Look up the employee to find their true role ("HR" or "EMPLOYEE")
            Employee employee = employeeRepository.findByEmail(email).orElse(null);
            
            if (employee != null) {
                // Map the role string to Spring Security granted authorities
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(employee.getRole());
                
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(email, null, List.of(authority));
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Set the user context explicitly inside Spring Security
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 4. Send the request down the line to the controller layer
        filterChain.doFilter(request, response);
    }
}