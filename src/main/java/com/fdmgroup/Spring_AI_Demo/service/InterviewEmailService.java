package com.fdmgroup.Spring_AI_Demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestion;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import com.fdmgroup.Spring_AI_Demo.mcp.EmailTools;
import org.springframework.stereotype.Service;

@Service
public class InterviewEmailService {

    private final InterviewQuestionGenerationService interviewQuestionService;
    private final EmailTools emailTools;

    public InterviewEmailService(
            InterviewQuestionGenerationService interviewQuestionService,
            EmailTools emailTools) {

        this.interviewQuestionService = interviewQuestionService;
        this.emailTools = emailTools;
    }

    public void sendInterviewQuestions(
            String candidateName,
            String candidateEmail,
            String jobDescription)
            throws JsonProcessingException {

        InterviewQuestionResponse response =
                interviewQuestionService.generateQuestions(
                        candidateName,
                        jobDescription);

        String emailBody = buildEmailBody(response);

        emailTools.sendEmail(
                candidateEmail,
                "Interview Questions - " + jobDescription,
                emailBody);
    }

    private String buildEmailBody(
            InterviewQuestionResponse response) {

        StringBuilder body = new StringBuilder();

        body.append("Interview Questions\n\n");

        int count = 1;

        for (InterviewQuestion question : response.interviewQuestions()) {

            body.append("==================================\n");
            body.append("Question ").append(count++).append("\n");
            body.append("==================================\n\n");

            body.append("Category: ")
                    .append(question.category())
                    .append("\n");

            body.append("Difficulty: ")
                    .append(question.difficulty())
                    .append("\n\n");

            body.append("Question:\n")
                    .append(question.question())
                    .append("\n\n");

            body.append("Expected Answer:\n")
                    .append(question.expectedAnswer())
                    .append("\n\n");
        }

        return body.toString();
    }
}