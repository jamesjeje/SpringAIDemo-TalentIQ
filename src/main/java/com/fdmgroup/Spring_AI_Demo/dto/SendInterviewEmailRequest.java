package com.fdmgroup.Spring_AI_Demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SendInterviewEmailRequest(

        @NotBlank
        String candidateName,

        @NotBlank
        @Email
        String candidateEmail,

        @NotBlank
        String jobDescription
) {}
