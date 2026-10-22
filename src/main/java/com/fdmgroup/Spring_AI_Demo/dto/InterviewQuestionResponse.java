package com.fdmgroup.Spring_AI_Demo.dto;



import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record InterviewQuestionResponse(
        @JsonProperty("interview_questions")
        List<InterviewQuestion> interviewQuestions

) {
}
