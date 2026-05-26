package com.secureems.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.secureems.backend.entity.Asset;
import com.secureems.backend.repository.AssetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssetService{

    private final AssetRepository repository;

    // Assign asset to employee
    public Asset assignAsset(Asset asset) {
        return repository.save(asset);
    }

    // Get assets of an employee
    public List<Asset> getAssetsByEmployee(Long empId) {
        return repository.findByEmpId(empId);
    }

    // Update asset status
    public Asset updateStatus(Long id, String status) {

        Asset asset = repository.findById(id)
                .orElseThrow();

        asset.setStatus(
                com.secureems.backend.entity.AssetStatus.valueOf(status)
        );

        return repository.save(asset);
    }

    // Delete asset
    public String deleteAsset(Long id) {

        repository.deleteById(id);
        return "Asset deleted successfully";
    }
}