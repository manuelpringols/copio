package com.copio.copio.service;

import com.copio.copio.entity.Page;
import com.copio.copio.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PageService {

    @Autowired
    private  PageRepository pageRepository;



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
}
