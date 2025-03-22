package com.copio.copio.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.copio.copio.entity.Snippet;


public interface SnippetRepository extends JpaRepository<Snippet,Integer> {

}
