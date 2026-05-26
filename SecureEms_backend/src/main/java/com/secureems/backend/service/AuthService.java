package com.secureems.backend.service;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.secureems.backend.dto.LoginRequest;
import com.secureems.backend.dto.RegisterRequest;
import com.secureems.backend.entity.Employee;
import com.secureems.backend.repository.EmployeeRepository;
import com.secureems.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmployeeRepository repository;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();
    

    public String register(RegisterRequest request) {

        String role = request.getDesignation()
                .equalsIgnoreCase("HR")
                ? "HR"
                : "EMPLOYEE";

        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .age(request.getAge())
                .bloodGroup(request.getBloodGroup())
                .city(request.getCity())
                .gender(request.getGender())
                .pincode(request.getPincode())
                .designation(request.getDesignation())
                .password(encoder.encode(request.getPassword()))
                .role(role)
                .hr(false)
                .otpVerified(true)
                .build();

        repository.save(employee);

        return "Employee Registered Successfully";
    }
    
    
    public String login(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email"));

        System.out.println("Entered Password: " +
                request.getPassword());

        System.out.println("DB Password: " +
                employee.getPassword());

        System.out.println("Matches: " +
                encoder.matches(
                        request.getPassword(),
                        employee.getPassword()
                ));

        if (!encoder.matches(
                request.getPassword(),
                employee.getPassword())) {

            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        return jwtUtil.generateToken(
                employee.getEmail()
        );
    }

    public String hrLogin(LoginRequest request) {

        Employee employee = repository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email"));

        if (!employee.getRole().equals("HR")) {
            throw new RuntimeException("Access Denied");
        }

        if (!encoder.matches(request.getPassword(),
                employee.getPassword())) {

            throw new RuntimeException("Invalid Password");
        }

        String otp = generateOtp();

        employee.setOtp(otp);

        repository.save(employee);

        emailService.sendMail(
                employee.getEmail(),
                "HR Login OTP",
                "Your OTP is : " + otp
        );

        return "OTP Sent Successfully";
    }

    public String verifyHrOtp(String email, String otp) {

        Employee employee = repository.findByEmail(email)
                .orElseThrow();

        if (!employee.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        employee.setOtp(null);

        repository.save(employee);

        return jwtUtil.generateToken(employee.getEmail());
    }

    public String forgotPassword(String email) {

        Employee employee = repository.findByEmail(email)
                .orElseThrow();

        String otp = generateOtp();

        employee.setOtp(otp);

        repository.save(employee);

        emailService.sendMail(
                email,
                "Reset Password OTP",
                "OTP : " + otp
        );

        return "OTP Sent";
    }

    public String resetPassword(
            String email,
            String otp,
            String newPassword
    ) {

        Employee employee = repository.findByEmail(email)
                .orElseThrow();

        if (!employee.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        employee.setPassword(
                encoder.encode(newPassword)
        );

        repository.save(employee);

        return "Password Reset Successful";
    }

    private String generateOtp() {

        return String.valueOf(
                100000 + new Random().nextInt(900000)
        );
    }
}