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

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

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
    
    public byte[] generateExcelReport() {
        DashboardAnalyticsDto data = getCentralDashboardMetrics();

        try (Workbook workbook = new XSSFWorkbook(); 
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Dashboard Analytics");

            // --- Section 1: KPI Metrics ---
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Metric Name");
            headerRow.createCell(1).setCellValue("Value");

            // Make headers bold
            CellStyle boldStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            boldStyle.setFont(font);
            headerRow.getCell(0).setCellStyle(boldStyle);
            headerRow.getCell(1).setCellStyle(boldStyle);

            int rowIdx = 1;
            sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Employees");
            sheet.getRow(rowIdx - 1).createCell(1).setCellValue(data.getTotalEmployees());

            sheet.createRow(rowIdx++).createCell(0).setCellValue("Active Employees");
            sheet.getRow(rowIdx - 1).createCell(1).setCellValue(data.getActiveEmployees());

            sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Assigned Assets");
            sheet.getRow(rowIdx - 1).createCell(1).setCellValue(data.getTotalAssignedAssets());

            sheet.createRow(rowIdx++).createCell(0).setCellValue("Pending Leave Requests");
            sheet.getRow(rowIdx - 1).createCell(1).setCellValue(data.getPendingLeaveRequests());

            sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Monthly Payroll Outflow");
            sheet.getRow(rowIdx - 1).createCell(1).setCellValue(data.getTotalMonthlyPayrollOutflow());

            // --- Section 2: Department Distribution ---
            rowIdx++; // Empty row for spacing
            Row deptHeader = sheet.createRow(rowIdx++);
            deptHeader.createCell(0).setCellValue("Department");
            deptHeader.createCell(1).setCellValue("Count");
            deptHeader.getCell(0).setCellStyle(boldStyle);
            deptHeader.getCell(1).setCellStyle(boldStyle);

            for (Map.Entry<String, Long> entry : data.getDepartmentWiseDistribution().entrySet()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(entry.getKey());
                row.createCell(1).setCellValue(entry.getValue());
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel file", e);
        }
    }
    
    public byte[] generateLeavesExcelReport() {
        DashboardAnalyticsDto data = getCentralDashboardMetrics();

        try (Workbook workbook = new XSSFWorkbook(); 
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Leave Analytics");

            // Header Styling
            CellStyle boldStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            boldStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Leave Status");
            headerRow.createCell(1).setCellValue("Application Count");
            headerRow.getCell(0).setCellStyle(boldStyle);
            headerRow.getCell(1).setCellStyle(boldStyle);

            int rowIdx = 1;
            for (Map.Entry<String, Long> entry : data.getLeaveStatusDistribution().entrySet()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(entry.getKey());
                row.createCell(1).setCellValue(entry.getValue());
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Leaves Excel report", e);
        }
    }

    public byte[] generateAssetsExcelReport() {
        DashboardAnalyticsDto data = getCentralDashboardMetrics();

        try (Workbook workbook = new XSSFWorkbook(); 
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Asset Inventory Analytics");

            // Header Styling
            CellStyle boldStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            boldStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Asset Operational Status");
            headerRow.createCell(1).setCellValue("Allocation Volume (Units)");
            headerRow.getCell(0).setCellStyle(boldStyle);
            headerRow.getCell(1).setCellStyle(boldStyle);

            int rowIdx = 1;
            for (Map.Entry<String, Long> entry : data.getAssetStatusDistribution().entrySet()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(entry.getKey().replace("_", " "));
                row.createCell(1).setCellValue(entry.getValue());
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Assets Excel report", e);
        }
    }
}