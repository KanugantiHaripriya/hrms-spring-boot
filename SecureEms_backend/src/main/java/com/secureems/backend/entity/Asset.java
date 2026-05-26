package com.secureems.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    private String trackingNumber;

    @Column(length = 2000)
    private String specifications;

    private Long empId;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;
    
    
}