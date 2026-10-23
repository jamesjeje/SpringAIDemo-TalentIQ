package com.fdmgroup.Spring_AI_Demo.service;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestion;

@Service
public class InterviewEmailService {

    private final InterviewQuestionGenerationService interviewQuestionService;
    private final EmailService emailService;

    public InterviewEmailService(
            InterviewQuestionGenerationService interviewQuestionService,
            EmailService emailService) {

        this.interviewQuestionService = interviewQuestionService;
        this.emailService = emailService;
    }

    public void sendInterviewQuestions(
            String candidateName,
            String candidateEmail,
            String jobDescription)
            throws JsonProcessingException {

        InterviewQuestionResponse response = interviewQuestionService.generateQuestions(
                candidateName,
                jobDescription);

        String emailBody = buildEmailBody(response);

        emailService.sendEmail(
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

            body.append(count++)
                    .append(". ")
                    .append(question.question())
                    .append("\n");

            body.append("Category: ")
                    .append(question.category())
                    .append("\n");

            body.append("Difficulty: ")
                    .append(question.difficulty())
                    .append("\n\n");
        }

        return body.toString();
    }
}
