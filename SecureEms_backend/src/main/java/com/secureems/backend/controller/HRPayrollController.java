package com.secureems.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureems.backend.entity.Payroll;
import com.secureems.backend.service.EmployeePayrollService;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "*") // Match your frontend port layout
public class HRPayrollController {

    @Autowired
    private EmployeePayrollService payrollService; // Inject the business service

    @PutMapping("/payroll/update/{employeeId}")
    public ResponseEntity<?> updateEmployeePayroll(@PathVariable Long employeeId, @RequestBody Payroll incomingPayroll) {
        return payrollService.calculateAndSavePayroll(employeeId, incomingPayroll)
                .map(savedPayroll -> ResponseEntity.ok("Payroll matrix successfully updated via 1:1 service layer."))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee profile matching ID not found."));
    }
}