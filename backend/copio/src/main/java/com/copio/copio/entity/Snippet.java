package com.copio.copio.entity;




import org.hibernate.engine.internal.ForeignKeys;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import lombok.Data;

@Entity
@Table(name = "snippets")
@Data // Lombok genererà automaticamente getter, setter, toString, hashCode e equals
public class Snippet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String title;
    
    private String content;

   @ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(foreignKey=@ForeignKey(name = "snippet_fk_group")
,name="idGroup",referencedColumnName="idGroup")
    private Group idGroup; // Riferimento al gruppo a cui appartiene lo snippet
}
