package com.secureems.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.secureems.backend.service.EmployeeBulkService;



@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*") // Adjust to match your frontend port
public class BulkUploadController {

    @Autowired
    private EmployeeBulkService bulkService;

    @PostMapping("/bulk-upload")
    public ResponseEntity<String> uploadBulkEmployees(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid Excel file!");
        }
        try {
            int savedCount = bulkService.saveEmployeesFromExcel(file);
            return ResponseEntity.ok("Successfully imported " + savedCount + " employees into Secure EMS database.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to parse Excel file: " + e.getMessage());
        }
    }
} 
