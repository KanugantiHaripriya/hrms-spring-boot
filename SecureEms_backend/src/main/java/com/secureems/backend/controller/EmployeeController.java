package com.secureems.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureems.backend.entity.Employee;
import com.secureems.backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmployeeController {

    private final EmployeeRepository repository;

    @GetMapping("/profile/{email}")
    public Employee getProfile(
            @PathVariable String email
    ) {

        return repository.findByEmail(email)
                .orElseThrow();
    }
}
