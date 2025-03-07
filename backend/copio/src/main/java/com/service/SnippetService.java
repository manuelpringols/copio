package com.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.copio.entity.Group;
import com.copio.entity.Snippet;
import com.copio.repository.GroupRepository;
import com.copio.repository.SnippetRepository;

@Service
public class SnippetService {

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private GroupRepository groupRepository;

    public Snippet createSnippet(Snippet snippet, Long groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));
        snippet.setGroup(group); // Impostiamo il gruppo al nuovo snippet
        return snippetRepository.save(snippet);
    }
}
