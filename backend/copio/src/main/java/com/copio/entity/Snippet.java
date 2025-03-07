package com.copio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "snippets")
@Data // Lombok genererà automaticamente getter, setter, toString, hashCode e equals
public class Snippet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String content;

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Group group; // Riferimento al gruppo a cui appartiene lo snippet
}
