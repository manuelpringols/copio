package com.copio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.copio.entity.Snippet;
import com.service.SnippetService;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    @Autowired
    private SnippetService snippetService;

    @PostMapping("/create")
    public Snippet createSnippet(@RequestBody Snippet snippet, @RequestParam Long groupId) {
        return snippetService.createSnippet(snippet, groupId);
    }
}