package com.fdmgroup.Spring_AI_Demo.dto;




import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record InterviewQuestion(
        String category,
        String question,
        String difficulty,
        String focusArea,
        String expectedAnswer
) {}