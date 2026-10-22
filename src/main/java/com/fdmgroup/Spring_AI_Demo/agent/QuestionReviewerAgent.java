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

                    Return improved JSON only.
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