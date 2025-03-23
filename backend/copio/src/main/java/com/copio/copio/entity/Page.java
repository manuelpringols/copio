package com.copio.copio.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ForeignKey;  // Importa la ForeignKey

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
    @ManyToOne //(cascade = CascadeType.REMOVE)    
    @JsonBackReference
    @JoinColumn(name = "group_page_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_group_page",
                                         foreignKeyDefinition = "FOREIGN KEY (group_page_id) REFERENCES group_page(id) ON DELETE CASCADE"))
    private GroupPage groupPage;

    @Override
public String toString() {
    return "Page{id=" + id + ", content='" + content + "'}";
}




}
