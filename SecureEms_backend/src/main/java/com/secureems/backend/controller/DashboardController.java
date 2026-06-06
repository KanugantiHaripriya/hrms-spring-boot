package com.secureems.backend.controller;

import com.secureems.backend.dto.DashboardAnalyticsDto;
import com.secureems.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/analytics")
    public ResponseEntity<DashboardAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(dashboardService.getCentralDashboardMetrics());
    }
    
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAnalytics() {
        byte[] excelData = dashboardService.generateExcelReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "SecureEMS_Analytics.xlsx");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelData);
    }
    
    @GetMapping("/export/leaves")
    public ResponseEntity<byte[]> exportLeavesAnalytics() {
        byte[] excelData = dashboardService.generateLeavesExcelReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "SecureEMS_Leaves_Report.xlsx");
        
        return ResponseEntity.ok().headers(headers).body(excelData);
    }

    @GetMapping("/export/assets")
    public ResponseEntity<byte[]> exportAssetsAnalytics() {
        byte[] excelData = dashboardService.generateAssetsExcelReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "SecureEMS_Assets_Report.xlsx");
        
        return ResponseEntity.ok().headers(headers).body(excelData);
    }
}