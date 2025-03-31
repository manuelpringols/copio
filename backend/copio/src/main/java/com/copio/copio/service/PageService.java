package com.copio.copio.service;

import com.copio.copio.controller.SnippetController;
import com.copio.copio.entity.Page;
import com.copio.copio.repository.PageRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
public class PageService {

    @Autowired
    private  PageRepository pageRepository;

    private static final Logger logger = LoggerFactory.getLogger(PageService.class);



    public List<Page> getAllPages() {
        return pageRepository.findAll();
    }

    public Optional<Page> getPageById(Integer id) {
        return pageRepository.findById(id);
    }

    public Page createPage(Page page) {
        return pageRepository.save(page);
    }

    public void deletePage(Integer id) {
        pageRepository.deleteById(id);
    }

    public Page updatePage(Integer id, Page page) {
        if (pageRepository.existsById(id)) {
            // Ottieni la pagina esistente
            Page existingPage = pageRepository.findById(id).orElse(null);
            
            if (existingPage != null) {
                // Non modificare il group_page_id
                page.setGroupPage(existingPage.getGroupPage());
                
                // Imposta l'ID della pagina (per evitare di cambiarlo)
                page.setId(id);
                
                // Salva la pagina senza modificare il groupPage_id
                return pageRepository.save(page);
            }
        }
        return null;
    }

    public List<Page> getPagesByGroupId(Integer groupId) {
        return pageRepository.findByGroupPageId(groupId);
    }

     // Metodo che restituisce tutte le pagine per un userId
     public List<Page> getPagesByUserId(Integer userId) {
        return pageRepository.findByUserId(userId);  // Metodo da implementare nel repository
    }

    public void deletePageByUserIdAndId(Long userId, Long idPage) {
        // Verifica se la pagina esiste per quell'utente
        Page page = pageRepository.findByIdAndUserId(idPage, userId)
                .orElseThrow(() -> new RuntimeException("Pagina non trovata per l'utente"));
    
        // Elimina la pagina
        pageRepository.delete(page);
    }

  



}
