package com.accord.backend.dto;

import lombok.Data;
import org.jspecify.annotations.Nullable;

@Data
public class LoginDTO {
    private String email;
    private String password;
}
