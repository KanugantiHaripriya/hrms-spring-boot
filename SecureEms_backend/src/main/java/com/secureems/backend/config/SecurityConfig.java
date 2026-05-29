package com.secureems.backend.config;


import lombok.RequiredArgsConstructor;
import com.secureems.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // Automatically injects our final fields like the JWT filter
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (Stateless tokens are immune to CSRF)
                .csrf(csrf -> csrf.disable())

                // 2. Enable CORS configuration (Tells Spring to look at your CorsConfig bean)
                .cors(cors -> {})

                // 3. Set Stateless Session Management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. Secure Endpoints based on roles
                .authorizeHttpRequests(auth -> auth
                        // Public auth routes (Login, register, reset password, etc.)
                        .requestMatchers("/auth/**").permitAll()

                        // HR Restricted Routes (Dashboard, Admin actions, Payroll overrides)
                        .requestMatchers("/hr/**").hasAuthority("HR")
                        .requestMatchers("/api/hr/**").hasAuthority("HR")
                        .requestMatchers("/api/dashboard/**").hasAuthority("HR")

                        // Common authenticated routes (Employees & HR accessing their own assets/leaves)
                        .requestMatchers("/assets/**").authenticated()
                        .requestMatchers("/employee/**").authenticated()
                        .requestMatchers("/leave/**").authenticated()

                        // Fallback: Any other path requires authentication
                        .anyRequest().authenticated()
                );

        // 5. Connect our custom Jwt Filter right before UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Declaring BCryptPasswordEncoder bean here ensures it's available to @Autowired throughout your services
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}