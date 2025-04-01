package com.copio.copio.controller;

import com.copio.copio.entity.Page;
import com.copio.copio.entity.UserEntity;
import com.copio.copio.service.PageService;
import com.copio.copio.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/pages")
public class PageController {

    private static final Logger logger = LoggerFactory.getLogger(PageController.class);

    @Autowired
    private PageService pageService;
    @Autowired
    private UserService userService;

    @GetMapping
    public List<Page> getAllPages() {
        logger.info("Request received to get all pages");
        List<Page> pages = pageService.getAllPages();
        if (pages.isEmpty()) {
            logger.warn("No pages found");
        } else {
            logger.info("Found {} pages", pages.size());
        }
        return pages;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page> getPageById(@PathVariable Integer id) {
        logger.info("Request received to get page with ID: {}", id);
        Optional<Page> page = pageService.getPageById(id);
        if (page.isPresent()) {
            logger.info("Page with ID {} found", id);
            return ResponseEntity.ok(page.get());
        } else {
            logger.warn("Page with ID {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<Page> createPage(@RequestBody Page page) {
        logger.info("Received request to create a new page: {}", page);
        Page createdPage = pageService.createPage(page);
        logger.info("Page created successfully with ID: {}", createdPage.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPage);
    }

   /*  @PutMapping("/{id}")
    public ResponseEntity<Page> updatePage(@PathVariable Integer id, @RequestBody Page page) {
        logger.info("Request received to update page with ID: {}", id);
        Page updatedPage = pageService.updatePage(id, page);
        if (updatedPage != null) {
            logger.info("Page with ID {} updated successfully", id);
            return ResponseEntity.ok(updatedPage);
        } else {
            logger.warn("Page with ID {} not found for update", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
        */

        @PutMapping("/{userId}/{id}")
public ResponseEntity<Page> updatePage(@PathVariable Integer userId, @PathVariable Integer id, @RequestBody Page page) {
    logger.info("Request received to update page with ID: {} for user ID: {}", id, userId);

    // Recuperiamo l'utente dal database
   Optional<UserEntity>  user = userService.findById(userId);
    if (user == null) {
        logger.warn("User with ID {} not found", userId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Troviamo la pagina solo se appartiene all'utente specifico
    Page existingPage = pageService.getPageByIdAndUserId(id, user.get().getId());
    if (existingPage == null) {
        logger.warn("Page with ID {} not found or does not belong to user ID {}", id, userId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Aggiorniamo i dati della pagina
    page.setId(id);  // Manteniamo lo stesso ID
    page.setUser(user.get());  // Assicuriamoci che resti legata allo stesso utente

    Page updatedPage = pageService.updatePage(id, page);
    logger.info("Page with ID {} updated successfully for user ID {}", id, userId);
    return ResponseEntity.ok(updatedPage);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Integer id) {
        logger.info("Request received to delete page with ID: {}", id);
        try {
            pageService.deletePage(id);
            logger.info("Page with ID {} deleted successfully", id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            logger.error("Error occurred while deleting page with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/byGroup/{groupId}")
    public ResponseEntity<List<Page>> getPagesByGroup(@PathVariable Integer groupId) {
        logger.info("Request received to get pages for groupId: {}", groupId);
        List<Page> pages = pageService.getPagesByGroupId(groupId);
        if (pages.isEmpty()) {
            logger.warn("No pages found for groupId: {}", groupId);
            return ResponseEntity.notFound().build();
        } else {
            logger.info("Found {} pages for groupId: {}", pages.size(), groupId);
            return ResponseEntity.ok(pages);
        }
    }

    @GetMapping("/byUserAndGroup/{userId}/{groupPageId}")
public ResponseEntity<List<Page>> getPagesByUserAndGroup(
        @PathVariable Integer userId, 
        @PathVariable Integer groupPageId) {
    
    logger.info("Request received to get pages for userId: {} and groupPageId: {}", userId, groupPageId);
    
    List<Page> pages = pageService.getPagesByUserIdAndGroupPageId(userId, groupPageId);
    
    if (pages.isEmpty()) {
        logger.warn("No pages found for userId: {} and groupPageId: {}", userId, groupPageId);
        return ResponseEntity.notFound().build();
    } else {
        logger.info("Found {} pages for userId: {} and groupPageId: {}", pages.size(), userId, groupPageId);
        return ResponseEntity.ok(pages);
    }
}

    @DeleteMapping("/user/{userId}/page/{idPage}")
    public void deletePageByUserIdAndId(@PathVariable Long userId, @PathVariable Integer idPage) {
        pageService.deletePageByUserIdAndId(userId, idPage);
    }


    @PostMapping("/{userId}")
public ResponseEntity<Page> createPage(@PathVariable Integer userId, @RequestBody Page page) {
    logger.info("Received request to create a new page for userId: {}", userId);

    // Recupera l'utente dal database
    UserEntity user = userService.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

    // Assegna l'utente alla pagina
    page.setUser(user); 

    // Salva la pagina
    Page createdPage = pageService.createPage(page);

    logger.info("Page created successfully with ID: {}", createdPage.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(createdPage);
}


}
