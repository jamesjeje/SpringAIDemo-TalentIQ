package com.fdmgroup.Spring_AI_Demo.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdmgroup.Spring_AI_Demo.dto.PlannerOutputDto;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class PlannerAgent {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public PlannerAgent(
            ChatClient.Builder builder,
            ObjectMapper objectMapper) {

        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public PlannerOutputDto identifyFocusAreas(
            String candidateInfo,
            String jobDescription) {

        String prompt = """
        You are an interview planning agent.

        Candidate:
        %s

        Job Description:
        %s

        Analyse the candidate profile against the job description.

        Identify:

        1. Key technical topics that should be assessed.
        2. Behavioural topics that should be assessed.
        3. Experience areas that require deeper investigation.

        Return ONLY valid JSON.

        The JSON MUST exactly match this structure:

        {
          "focusAreas": [
            "Spring Boot Architecture",
            "Java Concurrency & Multithreading"
          ],
          "key_technical_topics": [
            {
              "topic": "Java Concurrency",
              "focus": "Threading, synchronization and performance tuning"
            }
          ],
          "behavioural_topics": [
            {
              "topic": "Problem Solving",
              "focus": "Handling production incidents and complex defects"
            }
          ],
          "experience_areas_to_probe": [
            {
              "area": "System Migration",
              "questions": "What challenges were encountered during migration?"
            }
          ]
        }

        Rules:
        - Return valid JSON only.
        - Use camelCase property names exactly as shown.
        - Do not use snake_case.
        - Do not include markdown.
        - Do not wrap the response in ```json blocks.
        - All four fields must be present
        - focusAreas must contain 5-10 short topic names.
        - key_technical_topics must be an array of objects.
        - behavioural_topics must be an array of objects.
        - experience_areas_to_probe must be an array of objects.
        - Each technical topic object must contain: topic, focus.
        - Each behavioural topic object must contain: topic, focus.
        - Each experience area object must contain: area, questions.
        - Generate at least 5 technical topics.
        - Generate at least 4 behavioural topics.
        - Generate at least 4 experience areas.

        Return JSON only.
        """
                .formatted(candidateInfo, jobDescription);


        try {

            String response =
                    chatClient.prompt()
                            .user(prompt)
                            .call()
                            .content();
            System.out.println("===== RAW PLANNER RESPONSE =====");
            System.out.println(response);
            return objectMapper.readValue(
                    response,
                    PlannerOutputDto.class);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse planner output",
                    e);
        }
    }
}