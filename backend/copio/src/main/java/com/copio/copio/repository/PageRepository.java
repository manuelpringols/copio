package com.copio.copio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.copio.copio.entity.Page;

public interface PageRepository extends JpaRepository <Page,Integer> {

    List<Page> findByGroupPageId(Integer groupPageId);

}

