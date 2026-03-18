package com.matadorhouse.api.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "videojuegos")
@Data // Magia de Lombok: nos ahorra escribir todos los getters y setters a mano
@NoArgsConstructor
@AllArgsConstructor
public class Videojuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Llave primaria autoincremental

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String consola; // Ej: "PS4", "PS5"

    private String genero;

    /** Ej: PSN Plus, Acción, Deportes — para filtros en el catálogo */
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String imagenUrl;

    @Column(nullable = false)
    private BigDecimal precioPrincipal; // Precio para cuenta principal

    @Column(nullable = false)
    private BigDecimal precioSecundaria; // Precio para cuenta secundaria

    private Integer pesoGb;

    @Column(nullable = false)
    private boolean enStock = true;

    @OneToMany(mappedBy = "videojuego", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CuentaPSN> cuentasPsn;

    @Transient
    private Long stockPrincipal;

    @Transient
    private Long stockSecundaria;
}