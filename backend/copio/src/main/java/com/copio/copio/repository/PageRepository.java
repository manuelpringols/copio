package com.copio.copio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.copio.copio.entity.Page;

public interface PageRepository extends JpaRepository <Page,Integer> {

    List<Page> findByGroupPageId(Integer groupPageId);

    List<Page> findByUserId(Integer userId);

    
    // Trova la pagina per idPage e userId
    Optional<Page> findByIdAndUserId(Integer idPage, Long userId);

    List<Page> findByUserIdAndGroupPageId(Integer userId, Integer groupPageId);
    


}

