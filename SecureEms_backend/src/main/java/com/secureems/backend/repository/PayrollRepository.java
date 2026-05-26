package com.secureems.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.secureems.backend.entity.Payroll;

import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    // Helper to look up a payroll record directly by the associated Employee ID
    Optional<Payroll> findByEmployeeId(Long employeeId);
}
