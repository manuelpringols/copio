package com.copio.copio.controller;

import com.copio.copio.entity.GroupPage;
import com.copio.copio.entity.UserEntity;
import com.copio.copio.repository.UserRepository;
import com.copio.copio.service.GroupPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/groupPages")
public class GroupPageController {

    private static final Logger logger = LoggerFactory.getLogger(GroupPageController.class);

    @Autowired
    private GroupPageService groupPageService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<GroupPage> getAllGroupPages() {
        logger.info("Request received to get all group pages");
        List<GroupPage> groupPages = groupPageService.getAllGroupPages();
        if (groupPages.isEmpty()) {
            logger.warn("No group pages found");
        } else {
            logger.info("Found {} group pages", groupPages.size());
        }
        return groupPages;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupPage> getGroupPageById(@PathVariable Integer id) {
        logger.info("Request received to get group page with ID: {}", id);
        Optional<GroupPage> groupPage = groupPageService.getGroupPageById(id);
        if (groupPage.isPresent()) {
            logger.info("GroupPage with ID {} found", id);
            return ResponseEntity.ok(groupPage.get());
        } else {
            logger.warn("GroupPage with ID {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

   /* / @PostMapping
    public ResponseEntity<GroupPage> createGroupPage(@RequestBody GroupPage groupPage) {
        logger.info("Received request to create a new group page: {}", groupPage);
        GroupPage createdGroupPage = groupPageService.createGroupPage(groupPage);
        logger.info("GroupPage created successfully with ID: {}", createdGroupPage.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroupPage);
    }
    */

   @PostMapping("/create/{userId}")
public ResponseEntity<GroupPage> createGroupPage(@RequestBody String groupPageTitle, @PathVariable Integer userId) {
    logger.info("Received request to create a new group page: {}", groupPageTitle);

    // Recupera l'utente dal repository usando userId
    UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Associa l'utente al GroupPage

    // Salva il GroupPage
    GroupPage createdGroupPage = new GroupPage();

    createdGroupPage.setUser(user);
    createdGroupPage.setTitle(groupPageTitle);
    
    this.groupPageService.createGroupPage(createdGroupPage);





    logger.info("GroupPage created successfully with ID: {}", createdGroupPage.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(createdGroupPage);
}



    @PutMapping("/{id}")
    public ResponseEntity<GroupPage> updateGroupPage(@PathVariable Integer id, @RequestBody GroupPage groupPage) {
        logger.info("Request received to update group page with ID: {}", id);
        GroupPage updatedGroupPage = groupPageService.updateGroupPage(id, groupPage);
        if (updatedGroupPage != null) {
            logger.info("GroupPage with ID {} updated successfully", id);
            return ResponseEntity.ok(updatedGroupPage);
        } else {
            logger.warn("GroupPage with ID {} not found for update", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupPage(@PathVariable Integer id) {
        logger.info("Request received to delete group page with ID: {}", id);
        try {
            groupPageService.deleteGroupPage(id);
            logger.info("GroupPage with ID {} deleted successfully", id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            logger.error("Error occurred while deleting group page with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getGroupName/{id}")
    public ResponseEntity<String> getGroupById(@PathVariable("id") Integer groupId) {
        logger.info("Request received to get group name for groupId: {}", groupId);
        Optional<String> group = groupPageService.getGroupNameFromId(groupId);
        if (group.isPresent()) {
            logger.info("Group name for groupId {} found", groupId);
            return ResponseEntity.ok(group.get());
        } else {
            logger.warn("Group name for groupId {} not found", groupId);
            return ResponseEntity.notFound().build();
        }
    }

    // Nuovo metodo per ottenere tutte le GroupPage per un userId
    @GetMapping("/byUser/{userId}")
    public ResponseEntity<List<GroupPage>> getGroupPagesByUser(@PathVariable Integer userId) {
        logger.info("Request received to get group pages for userId: {}", userId);
        List<GroupPage> groupPages = groupPageService.getGroupPagesByUserId(userId);
        if (groupPages.isEmpty()) {
            logger.warn("No group pages found for userId: {}", userId);
            return ResponseEntity.notFound().build();
        } else {
            logger.info("Found {} group pages for userId: {}", groupPages.size(), userId);
            return ResponseEntity.ok(groupPages);
        }
    }

    @DeleteMapping("/byUser/{userId}")
public ResponseEntity<Void> deleteGroupPagesByUserId(@PathVariable Integer userId) {
    logger.info("Request received to delete group pages for userId: {}", userId);
    try {
        groupPageService.deleteGroupPagesByUserId(userId);
        logger.info("Group pages for userId {} deleted successfully", userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    } catch (Exception e) {
        logger.error("Error occurred while deleting group pages for userId {}: {}", userId, e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

  // Nuovo metodo per eliminare una GroupPage per userId e groupId
  @DeleteMapping("/byUser/{userId}/group/{groupId}")
  public ResponseEntity<Void> deleteGroupPageByUserAndGroupId(@PathVariable Integer userId, @PathVariable Integer groupId) {
      logger.info("Request received to delete group page for userId: {} and groupId: {}", userId, groupId);
      try {
          groupPageService.deleteGroupPageByUserAndGroupId(userId, groupId);
          logger.info("GroupPage for userId {} and groupId {} deleted successfully", userId, groupId);
          return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
      } catch (Exception e) {
          logger.error("Error occurred while deleting group page for userId {} and groupId {}: {}", userId, groupId, e.getMessage());
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
  }
}
