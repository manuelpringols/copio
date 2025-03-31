package com.copio.copio.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;  // Importa la ForeignKey

import lombok.Data;

@Data
@Entity
@Table(name = "pages", schema = "app")
public class Page {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String pageTitle;

    @Column( columnDefinition = "TEXT")
    private String content;
       // Relazione molti a uno con GroupPage
    @ManyToOne(fetch = FetchType.LAZY) //(cascade = CascadeType.REMOVE)    
    @JsonBackReference("group-page-page")
    @JoinColumn(name = "group_page_id", nullable = false,
                referencedColumnName = "id",
                foreignKey = @ForeignKey(name = "fk_group_page",
                                         foreignKeyDefinition = "FOREIGN KEY (group_page_id) REFERENCES app.group_pages(id) ON DELETE CASCADE"))
    private GroupPage groupPage;

    @Override
public String toString() {
    return "Page{id=" + id + ", content='" + content + "'}";
}


   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false,
                foreignKey = @ForeignKey(name = "page_fk_user"))
                
                @JsonBackReference("page-user")

    private UserEntity user;




}
