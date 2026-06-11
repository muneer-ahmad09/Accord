package com.accord.backend.dto;

import lombok.Data;

@Data
public class VerifyEmailDTO {

    private String email;
    private String otp;
}