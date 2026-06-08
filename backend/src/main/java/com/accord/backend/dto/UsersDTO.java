package com.accord.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class UsersDTO {

    @Email
    private String email;

    private String password_hashed;

    @NotBlank
    @Size(min = 5, max = 225)
    private String agency_name;

    @NotBlank
    @Size(min = 5, max = 50)
    private String tax_id;

    @Size(min = 10, max = 255)
    private String stripe_account_id;
}
