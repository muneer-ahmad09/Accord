package com.accord.backend.dto;

import com.accord.backend.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserLoginDto {
    private String id;
    private String email;
    private List<Role> roles;
    private String agencyName;
    private boolean emailVerified;

    private String taxId;

    private String stripeAccountId;
    private LocalDateTime createdAt;
}
