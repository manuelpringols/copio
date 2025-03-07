package com.copio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.copio.entity.Snippet;

public interface SnippetRepository extends JpaRepository<Snippet,Long> {

}
