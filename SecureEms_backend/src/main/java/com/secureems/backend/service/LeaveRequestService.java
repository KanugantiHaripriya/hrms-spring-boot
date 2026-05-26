package com.secureems.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.secureems.backend.entity.Employee;
import com.secureems.backend.entity.LeaveRequest;
import com.secureems.backend.repository.EmployeeRepository;
import com.secureems.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository repository;
    private final EmployeeRepository employeeRepository;
    private final EmailService emailService;
    
    @Value("${hr.email}")
    private String hrEmail;

//    public LeaveRequest submit(LeaveRequest lr) {
//        lr.setStatus("PENDING");
//        return repository.save(lr);
//    }
    
    public LeaveRequest submit(LeaveRequest lr) {

        lr.setStatus("PENDING");
        LeaveRequest saved = repository.save(lr);

        Employee emp = employeeRepository.findById(lr.getEmployeeId())
                .orElseThrow();

        // 📩 EMAIL TO HR (FIX ADDED)
        emailService.sendMail(
                hrEmail,
                "New Leave Request",
                "New leave request received:\n\n" +
                "Employee ID: " + emp.getId() +
                "\nEmployee Name: " + emp.getName() +
                "\nEmployee Email: " + emp.getEmail() +
                "\n\nLeave Details:" +
                "\nType: " + lr.getLeaveType() +
                "\nFrom: " + lr.getStartDate() +
                "\nTo: " + lr.getEndDate() +
                "\nReason: " + lr.getReason()
        );

        return saved;
    }

    public List<LeaveRequest> getAll() {
        return repository.findAll();
    }

    public List<LeaveRequest> getByEmployee(Long id) {
        return repository.findByEmployeeId(id);
    }


    
    public LeaveRequest approve(Long id) {

        LeaveRequest lr = repository.findById(id).orElseThrow();
        lr.setStatus("APPROVED");

        LeaveRequest saved = repository.save(lr);

        Employee emp = employeeRepository.findById(lr.getEmployeeId()).orElseThrow();

        emailService.sendMail(
                emp.getEmail(),
                "Leave Approved",
                "Hi " + emp.getName() +
                ",\nYour leave from " + lr.getStartDate() +
                " to " + lr.getEndDate() +
                " has been APPROVED."
        );

        return saved;
    }
    
    

//    public LeaveRequest reject(Long id, String reason) {
//
//        LeaveRequest lr = repository.findById(id).orElseThrow();
//        lr.setStatus("REJECTED");
//        lr.setRejectionReason(reason);
//
//        LeaveRequest saved = repository.save(lr);
//
//        Employee emp = employeeRepository.findById(lr.getEmployeeId()).orElseThrow();
//
//        emailService.sendMail(
//                emp.getEmail(),
//                "Leave Rejected",
//                "Reason: " + reason
//        );
//
//        return saved;
//    }
    
    
    public LeaveRequest reject(Long id, String reason) {

        LeaveRequest lr = repository.findById(id).orElseThrow();
        lr.setStatus("REJECTED");
        lr.setRejectionReason(reason);

        LeaveRequest saved = repository.save(lr);

        Employee emp = employeeRepository.findById(lr.getEmployeeId()).orElseThrow();

        emailService.sendMail(
                emp.getEmail(),
                "Leave Rejected",
                "Hi " + emp.getName() +
                ",\nYour leave has been REJECTED.\nReason: " + reason
        );

        return saved;
    }

    public Object getStats(Long id) {

        List<LeaveRequest> list = repository.findByEmployeeId(id);

        long total = list.size();
        long approved = list.stream().filter(l -> "APPROVED".equals(l.getStatus())).count();
        long rejected = list.stream().filter(l -> "REJECTED".equals(l.getStatus())).count();

        return new Object() {
            public final long totalRequests = total;
            public final long approvedLeaves = approved;
            public final long rejectedLeaves = rejected;
        };
    }
}
