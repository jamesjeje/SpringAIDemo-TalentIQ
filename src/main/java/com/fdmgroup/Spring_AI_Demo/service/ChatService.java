package com.fdmgroup.Spring_AI_Demo.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {



	    private final ChatClient chatClient;

	    public ChatService(ChatClient.Builder builder) {//for interacting with LLMs
	        this.chatClient = builder.build();//creates actual chatclient linked to Gemini
	    }

	    public String ask(String prompt) {//receives prompt from caller
	        return chatClient.prompt()//creates a new chat request
	                .user(prompt)//adds the user message
	                .call()//where the request is actually sent
	                .content();//gets text portion of AI response
	    }
	
}
