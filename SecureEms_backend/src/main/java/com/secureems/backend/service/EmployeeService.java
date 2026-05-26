package com.secureems.backend.service;

import org.springframework.stereotype.Service;

import com.secureems.backend.entity.Employee;
import com.secureems.backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository repository;

    public Employee getEmployeeById(Long id) {

        return repository.findById(id)
                .orElseThrow();
    }
}