package com.fdmgroup.Spring_AI_Demo.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class QuestionReviewerAgent {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public QuestionReviewerAgent(
            ChatClient.Builder builder,
            ObjectMapper objectMapper) {

        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public InterviewQuestionResponse reviewQuestions(
            InterviewQuestionResponse questions,
            String candidateInfo,
            String jobDescription) {

        try {

            String questionsJson =
                    objectMapper.writeValueAsString(questions);

            String prompt = """
                    You are a senior interview reviewer.

                    Job Description:
                    %s

                    Candidate Information:
                    %s

                    Draft Questions:
                    %s

                    Review and improve the questions.

                    Ensure:
                    - no duplicates
                    - no overlaps
                    - balanced difficulty distribution
                    - role relevance
                    - alignment with candidate experience
                    - clear and professional wording
                    - realistic expected answers
                    - questions are interview-ready

                    Ensure at least:
                    - 3 Intermediate questions
                    - 2 Advanced questions
                    - 1 Behavioural question
                    - 1 System Design question

                    Return ONLY valid JSON.
                    
                    Do not wrap the response in markdown.
                    Do not use ```json.
                    Do not provide any explanation.
                    
                    Expected format:
                    
                    {
                    "interview_questions": [
                    {
                    "category": "string",
                    "question": "string",
                    "difficulty": "string",
                    "focusArea": "string",
                    "expectedAnswer": "string"
                    }
                    ]
                    }
                   
                    Do not add any additional properties.
                   
                    Allowed properties:
                    - category
                    - question
                    - difficulty
                    - focusArea
                    - expectedAnswer
                   
                    Do NOT use:
                    - expectedArea
                    - answer
                    - sampleAnswer
                    - explanation
                    """
                    .formatted(
                            jobDescription,
                            candidateInfo,
                            questionsJson);

            String response =
                    chatClient.prompt()
                            .user(prompt)
                            .call()
                            .content();

            response = response
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
            System.out.println("===== CLEANED REVIEWER RESPONSE =====");
            System.out.println(response);


            return objectMapper.readValue(
                    response,
                    InterviewQuestionResponse.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse QuestionReviewer output",
                    e);
        }
    }
}