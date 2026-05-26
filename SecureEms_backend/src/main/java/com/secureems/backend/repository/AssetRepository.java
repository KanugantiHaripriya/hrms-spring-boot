package com.secureems.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureems.backend.entity.Asset;


public interface AssetRepository extends JpaRepository<Asset, Long>{
    List<Asset> findByEmpId(Long empId);
}