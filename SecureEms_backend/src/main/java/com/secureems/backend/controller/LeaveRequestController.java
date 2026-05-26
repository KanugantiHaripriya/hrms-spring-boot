package com.secureems.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secureems.backend.entity.LeaveRequest;
import com.secureems.backend.service.LeaveRequestService;

import jakarta.persistence.Entity;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/leave")
@CrossOrigin("*")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService service;

    // EMPLOYEE submit leave
    @PostMapping("/request")
    public LeaveRequest submit(@RequestBody LeaveRequest lr) {
        return service.submit(lr);
    }

    // EMPLOYEE view own leaves
    @GetMapping("/employee/{id}")
    public List<LeaveRequest> getEmployee(@PathVariable Long id) {
        return service.getByEmployee(id);
    }

    // EMPLOYEE status
    @GetMapping("/stats/{id}")
    public Object stats(@PathVariable Long id) {
        return service.getStats(id);
    }

    // HR view all
    @GetMapping("/all")
    public List<LeaveRequest> getAll() {
        return service.getAll();
    }

    // HR approve
    @PutMapping("/approve/{id}")
    public LeaveRequest approve(@PathVariable Long id) {
        return service.approve(id);
    }

    // HR reject
    @PutMapping("/reject/{id}")
    public LeaveRequest reject(
            @PathVariable Long id,
            @RequestParam String reason
    ) {
        return service.reject(id, reason);
    }
}
