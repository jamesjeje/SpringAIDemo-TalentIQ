package com.fdmgroup.Spring_AI_Demo.service;



import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChunkingService {

    public List<String> chunk(String text) {

        TokenTextSplitter splitter = new TokenTextSplitter();

        Document document = new Document(text);

        return splitter.split(document)
                .stream()
                .map(Document::getText)
                .toList();
    }
}