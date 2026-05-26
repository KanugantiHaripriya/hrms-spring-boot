package com.secureems.backend.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import com.secureems.backend.dto.LoginRequest;
import com.secureems.backend.dto.RegisterRequest;
import com.secureems.backend.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public String login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @PostMapping("/hr-login")
    public String hrLogin(
            @RequestBody LoginRequest request) {

        return authService.hrLogin(request);
    }

    @PostMapping("/verify-hr-otp")
    public String verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        return authService.verifyHrOtp(email, otp);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(
            @RequestParam String email) {

        return authService.forgotPassword(email);
    }

    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {

        return authService.resetPassword(
                email,
                otp,
                newPassword
        );
    }
}
