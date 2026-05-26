package com.secureems.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.secureems.backend.entity.Employee;
import com.secureems.backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HrService {

    private final EmployeeRepository repository;
    private final EmailService emailService;

    
    // add Employee through HR dashboard
    
    public Employee addEmployee(Employee employee) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String rawPassword =
                employee.getPassword();

        employee.setPassword(
                encoder.encode(rawPassword)
        );

        if (
            employee.getDesignation() != null &&
            employee.getDesignation().equalsIgnoreCase("HR")
        ) {

            employee.setRole("HR");
            employee.setHr(true);

        } else {

            employee.setRole("EMPLOYEE");
            employee.setHr(false);
        }

        employee.setOtpVerified(false);

        Employee savedEmployee =
                repository.save(employee);

        emailService.sendMail(
                savedEmployee.getEmail(),
                "SecureEMS Account Created",

                "Hello " + savedEmployee.getName() + ",\n\n" +

                "Your employee account has been created successfully by HR.\n\n" +

                "Employee Details:\n\n" +

                "Name: " + savedEmployee.getName() + "\n" +
                "Email: " + savedEmployee.getEmail() + "\n" +
                "Age: " + savedEmployee.getAge() + "\n" +
                "Blood Group: " + savedEmployee.getBloodGroup() + "\n" +
                "City: " + savedEmployee.getCity() + "\n" +
                "Gender: " + savedEmployee.getGender() + "\n" +
                "Pincode: " + savedEmployee.getPincode() + "\n" +
                "Designation: " + savedEmployee.getDesignation() + "\n\n" +

                "Temporary Password: " + rawPassword + "\n\n" +

                "Please login and change your password after first login.\n\n" +

                "Regards,\n" +
                "SecureEMS HR Team"
        );

        return savedEmployee;
    }

    public List<Employee> getAllEmployees() {

        return repository.findAll();
    }
    
    public Employee updateEmployee(
            Long id,
            Employee updatedEmployee
    ) {

        Employee employee =
                repository.findById(id)
                        .orElseThrow();

        employee.setName(
                updatedEmployee.getName()
        );

        employee.setEmail(
                updatedEmployee.getEmail()
        );

        employee.setAge(
                updatedEmployee.getAge()
        );

        employee.setBloodGroup(
                updatedEmployee.getBloodGroup()
        );

        employee.setCity(
                updatedEmployee.getCity()
        );

        employee.setGender(
                updatedEmployee.getGender()
        );

        employee.setPincode(
                updatedEmployee.getPincode()
        );

        employee.setDesignation(
                updatedEmployee.getDesignation()
        );

        if (
            updatedEmployee.getDesignation() != null &&
            updatedEmployee.getDesignation()
                    .equalsIgnoreCase("HR")
        ) {

            employee.setRole("HR");
            employee.setHr(true);

        } else {

            employee.setRole("EMPLOYEE");
            employee.setHr(false);
        }

        Employee saved =
                repository.save(employee);

        emailService.sendMail(
                saved.getEmail(),
                "Profile Updated",

                "Hello " + saved.getName() + ",\n\n" +

                "Your employee profile has been updated successfully by HR.\n\n" +

                "Updated Details:\n\n" +

                "Name: " + saved.getName() + "\n" +
                "Email: " + saved.getEmail() + "\n" +
                "Age: " + saved.getAge() + "\n" +
                "Blood Group: " + saved.getBloodGroup() + "\n" +
                "City: " + saved.getCity() + "\n" +
                "Gender: " + saved.getGender() + "\n" +
                "Pincode: " + saved.getPincode() + "\n" +
                "Designation: " + saved.getDesignation() + "\n\n" +

                "Regards,\n" +
                "SecureEMS HR Team"
        );

        return saved;
    }
    
    public String deleteEmployee(Long id) {

        Employee employee =
                repository.findById(id)
                        .orElseThrow();

        emailService.sendMail(
                employee.getEmail(),
                "Account Deleted",
                "Your account has been deleted by HR."
        );

        repository.deleteById(id);

        return "Employee Deleted Successfully";
    }

}







