package com.copio.copio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.copio.copio.entity.Group;
import com.copio.copio.entity.Snippet;
import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.GroupRepository;
import com.copio.copio.repository.SnippetRepository;
import com.copio.copio.repository.UserRepository;

@Service
public class SnippetService {

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    /*
     * public Snippet createSnippet(Snippet snippet, Integer groupId) {
     * Group group = groupRepository.findById(groupId).orElseThrow(() -> new
     * RuntimeException("Group not found"));
     * snippet.setIdGroup(group); // Impostiamo il gruppo al nuovo snippet
     * return snippetRepository.save(snippet);
     * 
     * 
     * }
     */

    public Snippet createSnippet(Snippet snippet, Integer userId, Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        snippet.setIdGroup(group); // Imposta il gruppo
        snippet.setUser(user); // Imposta l'utente

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

    public void deleteSnippet(Integer id) {
        if (!snippetRepository.existsById(id)) {
            throw new RuntimeException("Snippet non trovato con ID: " + id);
        }
        snippetRepository.deleteById(id);
    }

    public List<Snippet> getSnippetsByUserId(Integer userId) {
        return snippetRepository.findByUserId(userId);
    }

    // Elimina uno snippet per userId e snippetId
    public void deleteSnippetByUserIdAndId(Integer userId, Integer id) {
        Snippet snippet = snippetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException(
                        "Snippet not found for userId: " + userId + " and snippetId: " + id));

        snippetRepository.delete(snippet);
    }
}
