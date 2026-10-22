package com.fdmgroup.Spring_AI_Demo.Controller;


import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
//Verify Gemini API Key Works
    private final ChatClient chatClient;

    public TestController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/gemini")
    public String testGemini() {

        return chatClient.prompt()
                .user("Reply with the word SUCCESS")
                .call()
                .content();
    }
}