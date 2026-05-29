package com.secureems.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardAnalyticsDto {
    // Metric Cards
    private long totalEmployees;
    private long activeEmployees;
    private long totalAssignedAssets;
    private long pendingLeaveRequests;
    
    // Financial Metrics
    private double totalMonthlyPayrollOutflow;
    
    // Analytics Charts Data
    private Map<String, Long> departmentWiseDistribution; // e.g., {"HR": 5, "Engineering": 42}
    private Map<String, Long> assetStatusDistribution;     // e.g., {"IN_USE": 15, "IN_REPAIR": 2}
    private Map<String, Long> leaveStatusDistribution;     // e.g., {"PENDING": 3, "APPROVED": 14}
}