package com.accord.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class CreateUpdateClientDTO {
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
}
