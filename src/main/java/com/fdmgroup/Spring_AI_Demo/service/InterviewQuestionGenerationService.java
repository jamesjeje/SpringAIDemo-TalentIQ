package com.fdmgroup.Spring_AI_Demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fdmgroup.Spring_AI_Demo.agent.PlannerAgent;
import com.fdmgroup.Spring_AI_Demo.agent.QuestionReviewerAgent;
import com.fdmgroup.Spring_AI_Demo.agent.QuestionWriterAgent;
import com.fdmgroup.Spring_AI_Demo.dto.InterviewQuestionResponse;
import com.fdmgroup.Spring_AI_Demo.dto.PlannerOutputDto;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewQuestionGenerationService {

    private final VectorStore vectorStore;
    private final PlannerAgent plannerAgent;
    private final QuestionWriterAgent questionWriterAgent;
    private final QuestionReviewerAgent questionReviewerAgent;

    public InterviewQuestionGenerationService(
            VectorStore vectorStore,
            PlannerAgent plannerAgent,
            QuestionWriterAgent questionWriterAgent,
            QuestionReviewerAgent questionReviewerAgent) {

        this.vectorStore = vectorStore;
        this.plannerAgent = plannerAgent;
        this.questionWriterAgent = questionWriterAgent;
        this.questionReviewerAgent = questionReviewerAgent;
    }

    public InterviewQuestionResponse generateQuestions(
            String candidateName,
            String jobDescription) throws JsonProcessingException {

        List<Document> documents =
                vectorStore.similaritySearch(
                        SearchRequest.builder()
                                .query(candidateName)
                                .topK(10)
                                .build());

        List<Document> candidateDocuments =
                documents.stream()
                        .filter(doc ->
                                candidateName.equals(
                                        doc.getMetadata()
                                                .get("candidateName")))
                        .toList();

        if (candidateDocuments.isEmpty()) {
            throw  new RuntimeException( "No resume found for candidate: "
                    + candidateName);
        }

        Document first = candidateDocuments.getFirst();

        String resumeContext =
                candidateDocuments.stream()
                        .map(Document::getText)
                        .reduce("", (a, b) -> a + "\n" + b);

        String candidateInfo = """
                Candidate Name:
                %s

                Current Role:
                %s

                Skills:
                %s

                Summary:
                %s

                Resume:
                %s
                """
                .formatted(
                        candidateName,
                        first.getMetadata().get("currentRole"),
                        first.getMetadata().get("skills"),
                        first.getMetadata().get("summary"),
                        resumeContext
                );

        System.out.println("===== PLANNER AGENT =====");



        PlannerOutputDto plannerOutput =
                plannerAgent.identifyFocusAreas(
                        candidateInfo,
                        jobDescription);

        System.out.println("===== PLANNER AGENT OUTPUT =====");
        System.out.println(plannerOutput);

        System.out.println("===== QUESTION WRITER =====");


        InterviewQuestionResponse draftQuestions =
                questionWriterAgent.writeQuestions(
                        plannerOutput,
                        candidateInfo,
                        jobDescription);
        System.out.println("===== WRITER OUTPUT =====");
        System.out.println(draftQuestions);

        System.out.println("===== QUESTION REVIEWER =====");



       InterviewQuestionResponse finalQuestions =
                questionReviewerAgent.reviewQuestions(
                        draftQuestions,
                        candidateInfo,
                        jobDescription);
        System.out.println("===== REVIEWER OUTPUT =====");
        System.out.println(finalQuestions);

        return finalQuestions;
    }
}