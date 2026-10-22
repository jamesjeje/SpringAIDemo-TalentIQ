package com.fdmgroup.Spring_AI_Demo.service;

import org.springframework.stereotype.Service;

@Service
public class DataCleaningService {

    public String clean(String text) {

        return text
                .replaceAll("\\s+", " ")
                .trim();
    }
}