package com.fdmgroup.Spring_AI_Demo.service;

import com.fdmgroup.Spring_AI_Demo.model.CandidateMetadata;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;
import java.util.List;

@Service
public class MetadataExtractionService {

    private final ChatClient chatClient;

    public MetadataExtractionService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public CandidateMetadata extract(String resumeText) {

        System.out.println("METADATA EXTRACTION START");
        String prompt = """
            Extract the following information from this CV:

            - Candidate Name
            - Current Role
            - Skills
            - Professional Summary

            CV:
            %s
            """.formatted(resumeText);
        System.out.println("METADATA EXTRACTION COMPLETE");
        return chatClient.prompt(prompt)
                .call()
                .entity(CandidateMetadata.class);
    }
}