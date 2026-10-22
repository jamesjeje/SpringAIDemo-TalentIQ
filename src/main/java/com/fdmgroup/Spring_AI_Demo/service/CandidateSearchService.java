package com.fdmgroup.Spring_AI_Demo.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CandidateSearchService {

    private final VectorStore vectorStore;
    private final GeminiMatchingService geminiMatchingService;

    public CandidateSearchService(VectorStore vectorStore, GeminiMatchingService geminiMatchingService)
    {
        this.vectorStore = vectorStore;
        this.geminiMatchingService = geminiMatchingService;
    }

    public String search(String query) {

        List<Document> documents =
                vectorStore.similaritySearch(
                        SearchRequest.builder()
                                .query(query)
                                .topK(5)
                                .build());

        documents.forEach(doc -> {

            String candidateName =
                    (String) doc.getMetadata().get("candidateName");

            String currentRole =
                    (String) doc.getMetadata().get("currentRole");

            String skills =
                    (String) doc.getMetadata().get("skills");
        });

        return geminiMatchingService
                .analyseMatch(query, documents);
    }
}