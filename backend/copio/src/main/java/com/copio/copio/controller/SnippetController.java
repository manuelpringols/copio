package com.copio.copio.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.copio.copio.entity.Snippet;
import com.copio.copio.service.SnippetService;


@CrossOrigin(origins = "**")
@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    @Autowired
    private SnippetService snippetService;

    @CrossOrigin(origins = "**")
    @PostMapping("/create")
    public Snippet createSnippet(@RequestBody Snippet snippet, @RequestParam Integer groupId) {
        return snippetService.createSnippet(snippet, groupId);
    }


     // Metodo per ottenere tutti gli snippet
    @GetMapping("/all")
    public List<Snippet> getAllSnippets() {
        return snippetService.getAllSnippets();
    }

    // Metodo per ottenere uno snippet specifico per ID
    @GetMapping("/{id}")
    public Snippet getSnippetById(@PathVariable Integer id) {
        return snippetService.getSnippetById(id);
    }
}