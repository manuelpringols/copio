package com.copio.copio.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.copio.copio.entity.Snippet;


public interface SnippetRepository extends JpaRepository<Snippet,Integer> {

     // Metodo per ottenere gli snippet per ID utente
     List<Snippet> findByUserId(Integer userId);

     // Trova uno snippet per id e userId
    Optional<Snippet> findByIdAndUserId(Integer id, Integer userId);



}
