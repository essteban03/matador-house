package com.matadorhouse.api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cuentas_psn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaPSN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String estado = "DISPONIBLE";

    @Column(nullable = false)
    private String tipoCuenta; // "PRINCIPAL" o "SECUNDARIA"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "videojuego_id", nullable = false)
    @JsonBackReference
    private Videojuego videojuego;
}

