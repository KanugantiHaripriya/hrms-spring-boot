package com.secureems.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private int age;

    private String bloodGroup;

    private String city;

    private String gender;

    private String pincode;

    private String designation;

    private String password;

    private String role; // EMPLOYEE or HR

    private String otp;

    private Boolean hr;
    
    private Boolean otpVerified;
    
    
    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("employee") // Prevents infinite loops during JSON serialization
    private Payroll payroll;

    // Standard Getters & Setters
    public Payroll getPayroll() { return payroll; }
    public void setPayroll(Payroll payroll) { this.payroll = payroll; }
}