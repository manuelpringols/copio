package com.copio.copio.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.copio.copio.entity.Snippet;
import com.copio.copio.service.SnippetService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    private static final Logger logger = LoggerFactory.getLogger(SnippetController.class);

    @Autowired
    private SnippetService snippetService;

    /*@PostMapping("/create")
    public Snippet createSnippet(@RequestBody Snippet snippet, @RequestParam Integer groupId) {
        logger.info("Received request to create snippet for groupId: {}", groupId);
        Snippet createdSnippet = snippetService.createSnippet(snippet, groupId);
        if (createdSnippet != null) {
            logger.info("Snippet created successfully with ID: {}", createdSnippet.getId());
        } else {
            logger.error("Failed to create snippet for groupId: {}", groupId);
        }
        return createdSnippet;
    }
        */

     @PostMapping("/user/{userId}/group/{groupId}")
     public ResponseEntity<Snippet> createSnippet(
             @PathVariable Integer userId,
             @PathVariable Integer groupId,
             @RequestBody Snippet snippet) {
         
         logger.info("Received request to create snippet for userId: {} and groupId: {}", userId, groupId);
         
         try {
             Snippet createdSnippet = snippetService.createSnippet(snippet, userId, groupId);
             logger.info("Snippet created successfully with ID: {}", createdSnippet.getId());
             return ResponseEntity.status(HttpStatus.CREATED).body(createdSnippet);
         } catch (Exception e) {
             logger.error("Failed to create snippet for userId: {} and groupId: {} - Error: {}", userId, groupId, e.getMessage());
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
         }
     }
     


    // Metodo per ottenere tutti gli snippet
    @GetMapping("/all")
    public List<Snippet> getAllSnippets() {
        logger.info("Request received to get all snippets");
        List<Snippet> snippets = snippetService.getAllSnippets();
        if (snippets.isEmpty()) {
            logger.warn("No snippets found");
        } else {
            logger.info("Found {} snippets", snippets.size());
        }
        return snippets;
    }

    // Metodo per ottenere uno snippet specifico per ID
    @GetMapping("/{id}")
    public Snippet getSnippetById(@PathVariable Integer id) {
        logger.info("Request received to get snippet with ID: {}", id);
        Snippet snippet = snippetService.getSnippetById(id);
        if (snippet == null) {
            logger.warn("Snippet with ID {} not found", id);
        } else {
            logger.info("Snippet with ID {} found", id);
        }
        return snippet;
    }

    // Metodo per eliminare uno snippet per ID
    @DeleteMapping("/{id}")
    public void deleteSnippet(@PathVariable Integer id) {
        logger.info("Request received to delete snippet with ID: {}", id);
        try {
            snippetService.deleteSnippet(id);
            logger.info("Snippet with ID {} deleted successfully", id);
        } catch (Exception e) {
            logger.error("Error occurred while deleting snippet with ID {}: {}", id, e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Object> getSnippetsByUserId(@PathVariable Integer userId) {
        logger.info("Request received to get snippets for userId: {}", userId);
        List<Snippet> snippets = snippetService.getSnippetsByUserId(userId);
        
        if (snippets.isEmpty()) {
            logger.warn("No snippets found for userId: {}", userId);
            // Restituisce 404 con un messaggio nel corpo della risposta
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nessuno snippet trovato per id: " + userId);
        } else {
            logger.info("Found {} snippets for userId: {}", snippets.size(), userId);
            // Restituisce 200 OK con la lista di snippet
            return ResponseEntity.ok(snippets);
        }
    }
    
    

     // Metodo per eliminare uno snippet per userId e snippetId
   @DeleteMapping("/user/{userId}/snippet/{id}")
public ResponseEntity<Map<String, String>> deleteSnippetByUserIdAndId(@PathVariable Integer userId, @PathVariable Integer id) {
    logger.info("Request received to delete snippet with ID: {} for userId: {}", id, userId);
    try {
        snippetService.deleteSnippetByUserIdAndId(userId, id);
        logger.info("Snippet Con ID {} con userId {} eliminato con successo", id, userId);

        // Crea una mappa con il messaggio di successo
        Map<String, String> response = new HashMap<>();
        response.put("message", "Snippet Eliminato Con Successo con  userId: " + userId + " e snippetId: " + id);

        // Restituisci la risposta con il codice di stato NO_CONTENT (204) e corpo
        return ResponseEntity.status(HttpStatus.OK).body(response);
    } catch (Exception e) {
        logger.error("Nessun elemento trovato con  ID {} for userId {}: {}", id, userId, e.getMessage());

        // Crea una mappa con il messaggio di errore
        Map<String, String> response = new HashMap<>();
        response.put("message", "Nessun elemento trovato con  ID {} for userId {}: {} " + userId + " and snippetId: " + id);

        // Restituisci la risposta con il codice di stato INTERNAL_SERVER_ERROR (500) e corpo
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}


}
