package com.fdmgroup.Spring_AI_Demo.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ai.vectorstore.VectorStore;


@Configuration
public class VectorStoreConfig {
//Verify SimpleVectorStore Loads
    @Bean
    public VectorStore vectorStore(
            EmbeddingModel embeddingModel) {

        return SimpleVectorStore.builder(embeddingModel)
                .build();
    }
}