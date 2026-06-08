package com.accord.backend.dto;

import com.accord.backend.enums.ContractStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ContractResponseDTO {
    private UUID id;
    private UUID clientId;
    private UUID projectId;
    private String type;
    private ContractStatus status;
    private String documentUrl;
    private LocalDateTime signedAt;
    private LocalDateTime createdAt;
}
