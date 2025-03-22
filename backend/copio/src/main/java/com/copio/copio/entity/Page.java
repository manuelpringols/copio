package com.copio.copio.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String pageTitle;

    @Column( columnDefinition = "TEXT")
    private String content;
       // Relazione molti a uno con GroupPage
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "group_page_id")
    private GroupPage groupPage;

    @Override
public String toString() {
    return "Page{id=" + id + ", content='" + content + "'}";
}




}
