package com.fdmgroup.Spring_AI_Demo.Controller;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class VectorStoreTestController {

    private final VectorStore vectorStore;

    public VectorStoreTestController(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
    //Verify SimpleVectorStore Loads
    @GetMapping("/vector-store")
    public String test() {
        return "Vector Store Loaded";
    }
    //Verify You Can Store Documents
    @GetMapping("/store")
    public String storeDocument() {

        vectorStore.add(List.of(
                new Document(
                        "John knows Spring Boot")));

        return "Stored";
    }
    //Verify Semantic Search Works
    @GetMapping("/search")
    public List<Document> search() {

        return vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query("Spring Boot")
                        .topK(5)
                        .build());
    }
}
