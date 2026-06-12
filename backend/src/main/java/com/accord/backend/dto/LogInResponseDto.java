package com.accord.backend.dto;

import lombok.Data;

@Data
public class LogInResponseDto {
    private String token;
    private UserLoginDto user;
}
