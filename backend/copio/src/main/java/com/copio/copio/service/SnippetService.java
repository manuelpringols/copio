package com.copio.copio.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.copio.copio.entity.Group;
import com.copio.copio.entity.Snippet;
import com.copio.copio.repository.GroupRepository;
import com.copio.copio.repository.SnippetRepository;


@Service
public class SnippetService {

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private GroupRepository groupRepository;

    public Snippet createSnippet(Snippet snippet, Integer groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        snippet.setIdGroup(group); // Impostiamo il gruppo al nuovo snippet
        return snippetRepository.save(snippet);


    }

    // Metodo per ottenere tutti gli snippet
    public List<Snippet> getAllSnippets() {
        return snippetRepository.findAll();
    }

    // Metodo per ottenere uno snippet per ID
    public Snippet getSnippetById(Integer id) {
        Optional<Snippet> snippet = snippetRepository.findById(id);
        return snippet.orElseThrow(() -> new RuntimeException("Snippet non trovato con ID: " + id));
    }
}
