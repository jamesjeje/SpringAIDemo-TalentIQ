package com.fdmgroup.Spring_AI_Demo.service;

import com.fdmgroup.Spring_AI_Demo.model.CandidateMetadata;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VectorStoreService {

    private final VectorStore vectorStore;

    public VectorStoreService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void store(List<String> chunks,
                      CandidateMetadata metadata,
                      String fileName) {

        List<Document> documents = chunks.stream()
                .map(chunk -> new Document(
                        chunk,
                        Map.of(
                                "candidateName", metadata.candidateName(),
                                "currentRole", metadata.currentRole(),
                                "skills", String.join(",", metadata.skills()),
                                "summary", metadata.summary(),
                                "fileName", fileName
                        )
                ))
                .toList();

        vectorStore.add(documents);
    }

}