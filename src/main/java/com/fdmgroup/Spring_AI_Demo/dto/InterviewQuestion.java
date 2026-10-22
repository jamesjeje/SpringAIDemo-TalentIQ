package com.fdmgroup.Spring_AI_Demo.dto;



public record InterviewQuestion(
        String category,
        String question,
        String difficulty,
        String focusArea,
        String expectedAnswer
) {
}