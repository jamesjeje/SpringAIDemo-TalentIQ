package com.fdmgroup.Spring_AI_Demo.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionRequestDto;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import com.fdmgroup.Spring_AI_Demo.dto.SendInterviewEmailRequest;
import com.fdmgroup.Spring_AI_Demo.service.InterviewEmailService;
import com.fdmgroup.Spring_AI_Demo.service.InterviewQuestionGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewQuestionGenerationService service;
    private final InterviewEmailService interviewEmailService;

    public InterviewController(
            InterviewQuestionGenerationService service,
            InterviewEmailService interviewEmailService) {
        this.service = service;
        this.interviewEmailService = interviewEmailService;
    }

    @PostMapping("/questions")
    public InterviewQuestionResponse generateQuestions(
            @RequestBody InterviewQuestionRequestDto request) throws JsonProcessingException {

        return service.generateQuestions(
                request.candidateName(),
                request.jobDescription());
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendInterviewQuestions(
            @RequestBody SendInterviewEmailRequest request)
            throws JsonProcessingException {

        interviewEmailService.sendInterviewQuestions(
                request.candidateName(),
                request.candidateEmail(),
                request.jobDescription());

        return ResponseEntity.ok(
                "Interview questions emailed successfully");
    }
}
