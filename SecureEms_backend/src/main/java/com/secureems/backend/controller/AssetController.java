package com.secureems.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secureems.backend.entity.Asset;
import com.secureems.backend.service.AssetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/assets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService service;

    // Assign asset
    @PostMapping
    public Asset assignAsset(@RequestBody Asset asset) {
        return service.assignAsset(asset);
    }

    // Get assets by employee
    @GetMapping("/employee/{empId}")
    public List<Asset> getAssets(@PathVariable Long empId) {
        return service.getAssetsByEmployee(empId);
    }

    // Update status
    @PutMapping("/{id}/status")
    public Asset updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return service.updateStatus(id, status);
    }

    // Delete asset
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        return service.deleteAsset(id);
    }
}