package com.fdmgroup.Spring_AI_Demo.Controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionRequestDto;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import com.fdmgroup.Spring_AI_Demo.service.InterviewQuestionGenerationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewQuestionGenerationService service;

    public InterviewController(
            InterviewQuestionGenerationService service) {
        this.service = service;
    }

    @PostMapping("/questions")
    public InterviewQuestionResponse generateQuestions(
            @RequestBody InterviewQuestionRequestDto request) throws JsonProcessingException {

        return service.generateQuestions(
                request.candidateName(),
                request.jobDescription());
    }
}
