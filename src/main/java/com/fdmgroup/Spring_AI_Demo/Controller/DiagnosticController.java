//package com.fdmgroup.Spring_AI_Demo.Controller;
//
//import org.springframework.ai.embedding.EmbeddingModel;
//import org.springframework.context.ApplicationContext;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.Arrays;
//
//@RestController
//@RequestMapping("/diag")
//public class DiagnosticController {
//
//    private final ApplicationContext context;
//
//    public DiagnosticController(ApplicationContext context) {
//        this.context = context;
//    }
//
//    @GetMapping
//    public String beans() {
//
//        String[] beans =
//                context.getBeanNamesForType(EmbeddingModel.class);
//
//        return Arrays.toString(beans);
//    }
//}