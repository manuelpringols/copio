package com.copio.copio.controller;

import com.copio.copio.entity.Page;
import com.copio.copio.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pages")
public class PageController {

    @Autowired

    private  PageService pageService;

 

    @GetMapping
    public List<Page> getAllPages() {
        return pageService.getAllPages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page> getPageById(@PathVariable Integer id) {
        Optional<Page> page = pageService.getPageById(id);
        return page.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Page> createPage(@RequestBody Page page) {
        Page createdPage = pageService.createPage(page);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Page> updatePage(@PathVariable Integer id, @RequestBody Page page) {
        Page updatedPage = pageService.updatePage(id, page);
        return updatedPage != null ? ResponseEntity.ok(updatedPage) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Integer id) {
        pageService.deletePage(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/byGroup/{groupId}")
    public ResponseEntity<List<Page>> getPagesByGroup(@PathVariable Integer groupId) {
        List<Page> pages = pageService.getPagesByGroupId(groupId);
        System.out.println("PAGGINE --> " + pages);
    
        if (pages.isEmpty()) {
            return ResponseEntity.notFound().build();
        }


        return ResponseEntity.ok(pages);
}
}
