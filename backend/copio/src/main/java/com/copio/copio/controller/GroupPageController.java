package com.copio.copio.controller;

import com.copio.copio.entity.GroupPage;
import com.copio.copio.service.GroupPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groupPages")
public class GroupPageController {

    @Autowired
    private  GroupPageService groupPageService;



    @GetMapping
    public List<GroupPage> getAllGroupPages() {
        return groupPageService.getAllGroupPages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupPage> getGroupPageById(@PathVariable Integer id) {
        Optional<GroupPage> groupPage = groupPageService.getGroupPageById(id);
        return groupPage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<GroupPage> createGroupPage(@RequestBody GroupPage groupPage) {
        GroupPage createdGroupPage = groupPageService.createGroupPage(groupPage);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroupPage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupPage> updateGroupPage(@PathVariable Integer id, @RequestBody GroupPage groupPage) {
        GroupPage updatedGroupPage = groupPageService.updateGroupPage(id, groupPage);
        return updatedGroupPage != null ? ResponseEntity.ok(updatedGroupPage) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroupPage(@PathVariable Integer id) {
        groupPageService.deleteGroupPage(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
