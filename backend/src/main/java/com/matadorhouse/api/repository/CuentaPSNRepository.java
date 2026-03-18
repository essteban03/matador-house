package com.matadorhouse.api.repository;

import com.matadorhouse.api.entity.CuentaPSN;
import com.matadorhouse.api.entity.Videojuego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CuentaPSNRepository extends JpaRepository<CuentaPSN, Long> {
    long countByVideojuegoAndTipoCuentaAndEstado(Videojuego videojuego, String tipoCuenta, String estado);
}

