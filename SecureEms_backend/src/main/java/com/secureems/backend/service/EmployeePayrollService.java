package com.secureems.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.secureems.backend.entity.Payroll;
import com.secureems.backend.repository.EmployeeRepository;
import com.secureems.backend.repository.PayrollRepository;

import jakarta.transaction.Transactional;

@Service
public class EmployeePayrollService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    /**
     * Creates or updates a 1:1 payroll record for a specific employee.
     * All calculations are handled automatically based on Basic Salary and HRA.
     */
    @Transactional
    public Optional<Payroll> calculateAndSavePayroll(Long employeeId, Payroll incomingData) {
        return employeeRepository.findById(employeeId).map(employee -> {
            
            // 1. Fetch existing payroll record or initialize a new one (1:1 constraint)
            Payroll payroll = payrollRepository.findByEmployeeId(employeeId)
                    .orElse(new Payroll());

            // 2. Map Parent Relationship Object
            payroll.setEmployee(employee);

            // 3. Extract core inputs from the frontend payload
            double basic = incomingData.getBasicSalary() != null ? incomingData.getBasicSalary() : 0.0;
            double hra = incomingData.getHra() != null ? incomingData.getHra() : 0.0;
            
            // 4. Set Inputs
            payroll.setBasicSalary(basic);
            payroll.setHra(hra);

            // 5. Run Automatic Payroll Mathematics Logic Pipeline
            double allowances = 1250.0; // Flat conditional processing allowance
            double grossSalary = basic + hra + allowances;

            // Statutory Deductions Matrix
            double pf = Math.round(basic * 0.12); // PF = 12% of Basic
            
            // ESI = 0.75% of Gross Salary if Gross is <= 21,000 INR
            double esi = (grossSalary <= 21000.0) ? Math.round(grossSalary * 0.0075) : 0.0;
            
            // PT Tiers based on Basic earnings threshold
            double pt = (basic >= 15000.0) ? 200.0 : 150.0;
            
            double insurance = 350.0; // Standard flat coverage deduction

            // Aggregate Summary Accumulations
            double totalDeductions = pf + esi + pt + insurance;
            double netSalary = grossSalary - totalDeductions;

            // 6. Map All Evaluated Metrics to the Entity Object
            payroll.setGrossSalary(grossSalary);
            payroll.setPf(pf);
            payroll.setEsi(esi);
            payroll.setPt(pt);
            payroll.setInsurance(insurance);
            payroll.setTotalDeductions(totalDeductions);
            payroll.setNetSalary(netSalary);

            // 7. Persist child record into MySQL table
            return payrollRepository.save(payroll);
        });
    }
}
