package com.accord.backend.dto;

import lombok.Data;

@Data
public class CreateContractDTO {
    private String clientId;
    private String projectId; // Nullable (optional)
    private String type;      // "NDA", "MSA", "SOW"
}