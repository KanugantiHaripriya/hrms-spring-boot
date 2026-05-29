package com.secureems.backend.service;

import com.secureems.backend.dto.DashboardAnalyticsDto;
import com.secureems.backend.entity.Asset;
import com.secureems.backend.entity.Employee;
import com.secureems.backend.entity.LeaveRequest;
import com.secureems.backend.entity.Payroll;
import com.secureems.backend.repository.AssetRepository;
import com.secureems.backend.repository.EmployeeRepository;
import com.secureems.backend.repository.LeaveRequestRepository;
import com.secureems.backend.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AssetRepository assetRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    public DashboardAnalyticsDto getCentralDashboardMetrics() {
        // Fetch raw global list data safely
        List<Employee> allEmployees = employeeRepository.findAll();
        List<Asset> allAssets = assetRepository.findAll();
        List<LeaveRequest> allLeaves = leaveRequestRepository.findAll();
        List<Payroll> allPayroll = payrollRepository.findAll();

        // 1. Calculate General Aggregations with Null Guards
        long totalEmp = allEmployees.size();
        
        // Fix: Safely handle null fields by explicitly checking for Boolean.TRUE
        long activeEmp = allEmployees.stream()
                .filter(e -> e.getOtpVerified() != null && e.getOtpVerified())
                .count();
        
        long assignedAssets = allAssets.stream()
                .filter(asset -> asset.getEmpId() != null)
                .count();
                
        long pendingLeaves = allLeaves.stream()
                .filter(leave -> leave.getStatus() != null && "PENDING".equalsIgnoreCase(leave.getStatus()))
                .count();

        // 2. Financial Metrics Summation with Null Guards
        double totalPayrollOutflow = allPayroll.stream()
                .filter(p -> p != null && p.getNetSalary() != null) // Avoid primitive unboxing failures
                .mapToDouble(Payroll::getNetSalary)
                .sum();

        // 3. Department-wise Distribution Map (Grouping safely by designation)
        Map<String, Long> deptDistribution = allEmployees.stream()
                .filter(e -> e.getDesignation() != null && !e.getDesignation().trim().isEmpty())
                .collect(Collectors.groupingBy(Employee::getDesignation, Collectors.counting()));

        // 4. Asset Status Distribution Map
        Map<String, Long> assetDistribution = allAssets.stream()
                .filter(a -> a.getStatus() != null)
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));

        // 5. Leave Status Distribution Map
        Map<String, Long> leaveDistribution = allLeaves.stream()
                .filter(l -> l.getStatus() != null && !l.getStatus().trim().isEmpty())
                .collect(Collectors.groupingBy(LeaveRequest::getStatus, Collectors.counting()));

        // Build and return the consolidated dashboard metric bundle cleanly
        return DashboardAnalyticsDto.builder()
                .totalEmployees(totalEmp)
                .activeEmployees(activeEmp)
                .totalAssignedAssets(assignedAssets)
                .pendingLeaveRequests(pendingLeaves)
                .totalMonthlyPayrollOutflow(totalPayrollOutflow)
                .departmentWiseDistribution(deptDistribution)
                .assetStatusDistribution(assetDistribution)
                .leaveStatusDistribution(leaveDistribution)
                .build();
    }
}