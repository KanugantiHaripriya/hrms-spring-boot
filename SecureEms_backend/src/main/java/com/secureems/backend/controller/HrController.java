package com.secureems.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.secureems.backend.entity.Employee;
import com.secureems.backend.service.HrService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor
public class HrController {

    private final HrService hrService;

    @PostMapping("/add")
    public Employee addEmployee(
            @RequestBody Employee employee) {

        return hrService.addEmployee(employee);
    }

    @GetMapping("/all")
    public List<Employee> getAll() {

        return hrService.getAllEmployees();
    }

    @PutMapping("/update/{id}")
    public Employee update(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return hrService.updateEmployee(id, employee);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(
            @PathVariable Long id) {

        return hrService.deleteEmployee(id);
    }
}
