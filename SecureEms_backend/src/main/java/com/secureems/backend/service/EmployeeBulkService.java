package com.secureems.backend.service;

import com.secureems.backend.dto.RegisterRequest;
import com.secureems.backend.entity.Employee;
import com.secureems.backend.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.*; // For Workbook, Sheet, Row, Cell
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


@Service
public class EmployeeBulkService {

    // Inject your real EmployeeRepository or use your registration logic workflow
    // @Autowired private UserRepository userRepository;

	@Autowired 
    private EmployeeRepository employeeRepository;
	
	public int saveEmployeesFromExcel(MultipartFile file) throws Exception {
    	
        List<RegisterRequest> requests = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // Skip header line
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                RegisterRequest request = new RegisterRequest();
                
                // Iterating safely across our columns matching the DTO sequence
                request.setName(getCellValueAsString(currentRow.getCell(0)));
                request.setEmail(getCellValueAsString(currentRow.getCell(1)));
                
                // Handle age safely from double numeric representations in excel cells
                String ageStr = getCellValueAsString(currentRow.getCell(2));
                request.setAge(ageStr.isEmpty() ? 0 : (int) Double.parseDouble(ageStr));
                
                request.setBloodGroup(getCellValueAsString(currentRow.getCell(3)));
                request.setCity(getCellValueAsString(currentRow.getCell(4)));
                request.setGender(getCellValueAsString(currentRow.getCell(5)));
                request.setPincode(getCellValueAsString(currentRow.getCell(6)));
                request.setDesignation(getCellValueAsString(currentRow.getCell(7)));
                request.setPassword(getCellValueAsString(currentRow.getCell(8)));

                requests.add(request);
            }
        }

        // Save records using your existing database logic architecture
        for (RegisterRequest req : requests) {
            Employee emp = new Employee();
            emp.setName(req.getName());
            emp.setEmail(req.getEmail());
            emp.setAge(req.getAge());
            emp.setBloodGroup(req.getBloodGroup());
            emp.setCity(req.getCity());
            emp.setGender(req.getGender());
            emp.setPincode(req.getPincode());
            emp.setDesignation(req.getDesignation());
            emp.setPassword(req.getPassword()); 
            

            // This line tells Spring Boot to insert the row into MySQL!
            employeeRepository.save(emp); 
        }

        return requests.size();
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue().trim();
            case NUMERIC: 
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return "";
        }
    }
}