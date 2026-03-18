package com.matadorhouse.api.controller;

import com.matadorhouse.api.entity.CuentaPSN;
import com.matadorhouse.api.entity.Videojuego;
import com.matadorhouse.api.repository.CuentaPSNRepository;
import com.matadorhouse.api.repository.VideojuegoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/videojuegos")
public class VideojuegoController {

    private final VideojuegoRepository videojuegoRepository;
    private final CuentaPSNRepository cuentaPSNRepository;

    public VideojuegoController(VideojuegoRepository videojuegoRepository,
                                CuentaPSNRepository cuentaPSNRepository) {
        this.videojuegoRepository = videojuegoRepository;
        this.cuentaPSNRepository = cuentaPSNRepository;
    }

    @GetMapping
    public ResponseEntity<List<Videojuego>> obtenerTodos() {
        List<Videojuego> videojuegos = videojuegoRepository.findAll();

        // Enriquecer cada videojuego con el conteo de cuentas disponibles por tipo
        videojuegos.forEach(videojuego -> {
            long stockPrincipal = cuentaPSNRepository.countByVideojuegoAndTipoCuentaAndEstado(
                    videojuego, "PRINCIPAL", "DISPONIBLE"
            );
            long stockSecundaria = cuentaPSNRepository.countByVideojuegoAndTipoCuentaAndEstado(
                    videojuego, "SECUNDARIA", "DISPONIBLE"
            );
            videojuego.setStockPrincipal(stockPrincipal);
            videojuego.setStockSecundaria(stockSecundaria);
        });

        return ResponseEntity.ok(videojuegos);
    }

    @PostMapping
    public ResponseEntity<Videojuego> crear(@RequestBody Videojuego videojuego) {
        Videojuego guardado = videojuegoRepository.save(videojuego);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Videojuego> actualizar(
            @PathVariable Long id,
            @RequestBody Videojuego body
    ) {
        Optional<Videojuego> opt = videojuegoRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Videojuego v = opt.get();
        v.setTitulo(body.getTitulo());
        v.setConsola(body.getConsola());
        v.setGenero(body.getGenero());
        v.setCategoria(body.getCategoria());
        v.setDescripcion(body.getDescripcion());
        v.setImagenUrl(body.getImagenUrl());
        v.setPrecioPrincipal(body.getPrecioPrincipal());
        v.setPrecioSecundaria(body.getPrecioSecundaria());
        v.setPesoGb(body.getPesoGb());
        v.setEnStock(body.isEnStock());
        Videojuego guardado = videojuegoRepository.save(v);
        return ResponseEntity.ok(guardado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Optional<Videojuego> existente = videojuegoRepository.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        videojuegoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cuentas")
    public ResponseEntity<CuentaPSN> crearCuentaParaVideojuego(
            @PathVariable Long id,
            @RequestBody CrearCuentaRequest request
    ) {
        Optional<Videojuego> videojuegoOpt = videojuegoRepository.findById(id);
        if (videojuegoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Videojuego videojuego = videojuegoOpt.get();

        CuentaPSN cuenta = new CuentaPSN();
        cuenta.setEmail(request.email());
        cuenta.setPassword(request.password());
        cuenta.setEstado("DISPONIBLE");
        cuenta.setTipoCuenta(request.tipoCuenta());
        cuenta.setVideojuego(videojuego);

        CuentaPSN guardada = cuentaPSNRepository.save(cuenta);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    public record CrearCuentaRequest(String email, String password, String tipoCuenta) {
    }
}

