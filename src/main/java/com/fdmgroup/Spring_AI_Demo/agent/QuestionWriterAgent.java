package com.fdmgroup.Spring_AI_Demo.agent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import com.fdmgroup.Spring_AI_Demo.dto.PlannerOutputDto;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
@Service
public class QuestionWriterAgent {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    public QuestionWriterAgent(ChatClient.Builder builder,ObjectMapper objectMapper) {
        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public InterviewQuestionResponse writeQuestions(
            PlannerOutputDto plannerOutput,
            String candidateInfo,
            String jobDescription) throws JsonProcessingException {

        String prompt = """
                You are an interview question writer.
                
                Job Description:
                %s

                Focus Areas:
                %s

                Candidate Information:
                %s

                Generate:

                - technical questions
                - behavioural questions
                - follow-up questions

                Every question must contain:
                
                - category
                - question
                - difficulty
                - focusArea
                - expectedAnswer
                
                category must be one of:
                - Technical
                - Behavioural
                - System Design
                - Follow-Up
                
                difficulty must be one of:
                - Beginner
                - Intermediate
                - Advanced

                Return JSON only.
                
                {
                  "interview_questions": [
                    {
                      "category": "Technical",
                      "question": "",
                      "difficulty": "Intermediate",
                      "focusArea": "",
                      "expectedAnswer": ""
                    }
                  ]
                }
                
                Do NOT include markdown.
                
                Do NOT wrap the response in:
                ```json
                """
                .formatted(
                        jobDescription,
                        plannerOutput.focusAreas(),
                        plannerOutput.technicalTopics(),
                        plannerOutput.behaviouralTopics(),
                        plannerOutput.experienceAreasToProbe(),
                        candidateInfo);

        System.out.println("QUESTION WRITER START");
        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();
        System.out.println("===== QUESTION WRITER RESPONSE =====");
        System.out.println(response);
        System.out.println("QUESTION WRITER COMPLETE");
        return objectMapper.readValue(
                response,
                InterviewQuestionResponse.class);
    }
}