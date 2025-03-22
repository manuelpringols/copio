package com.copio.copio.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class GroupPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Questo genera automaticamente l'ID
    private Integer id;
    
    private String title;
    
    
    // Relazione uno a molti con Page
    @OneToMany(mappedBy = "groupPage") // MappedBy è il nome del campo nella classe Page
    @JsonManagedReference
    private List<Page> pages;

}
