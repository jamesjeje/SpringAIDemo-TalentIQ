package com.fdmgroup.Spring_AI_Demo.Controller;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class EmbeddingTestController {
//Verify Embedding Model Works
    private final EmbeddingModel embeddingModel;

    public EmbeddingTestController(
            EmbeddingModel embeddingModel) {

        this.embeddingModel = embeddingModel;
    }

    @GetMapping("/embedding")
    public Integer embeddingTest() {

        float[] vector =
                embeddingModel.embed("Spring Boot Developer");

        return vector.length;
    }
}