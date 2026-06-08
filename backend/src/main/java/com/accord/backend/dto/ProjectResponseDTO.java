package com.accord.backend.dto;

import com.accord.backend.enums.ProjectStatus;
import lombok.Data;
import java.util.UUID;

@Data
public class ProjectResponseDTO {
    private UUID id;
    private String name;
    private UUID clientId;
    private ProjectStatus status;
}