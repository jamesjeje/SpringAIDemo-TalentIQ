package com.fdmgroup.Spring_AI_Demo.service;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;

import java.util.List;

@Service
public class GeminiMatchingService {

    private final ChatClient chatClient;

    public GeminiMatchingService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String analyseMatch(String query,
                               List<Document> documents) {

        String context = documents.stream()
                .map(Document::getText)
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = """
                You are a recruitment assistant.

                Recruiter Query:
                %s

                Candidate Information:
                %s

                Return only JSON.
                
                {
                  "candidateName": "",
                  "matchScore": "",
                  "matchLevel": "",
                  "skills": [],
                  "strengths": [],
                  "gaps": [],
                  "recommendation": ""
                }
                Important:
                - matchScore must be numeric
                - matchScore must be between 0.00 and 1.00
                - do NOT use percentages
                - do NOT use strings such as "95/100"
                """
                .formatted(query, context);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}