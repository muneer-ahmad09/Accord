package com.accord.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class GetClientsDTO {

    @NotBlank
    private UUID clientId;

    @NotBlank
    private UUID userId;
    @NotBlank
    @Size(min = 3, max = 255)
    private String companyName;
    @Email
    @Size(min = 8, max = 255)
    private String contactEmail;
    @NotBlank
    private String billingAddress;
    @NotBlank
    @Size(min = 1, max = 50)
    private String country;
    @NotBlank
    private LocalDateTime  createdAt;
}
