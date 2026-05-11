package com.neurocode.sportbook.service;

import com.neurocode.sportbook.dto.LoginRequest;
import com.neurocode.sportbook.dto.LoginResponse;
import com.neurocode.sportbook.dto.RegistroRequest;
import com.neurocode.sportbook.dto.UsuarioResponse;
import com.neurocode.sportbook.entity.Rol;
import com.neurocode.sportbook.entity.Usuario;
import com.neurocode.sportbook.repository.RolRepository;
import com.neurocode.sportbook.repository.UsuarioRepository;
import com.neurocode.sportbook.security.JwtUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository,
                       RolRepository rolRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       @Lazy AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    /** Spring Security usa este método para cargar el usuario al validar el token */
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));

        return new User(
                usuario.getCorreo(),
                usuario.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombreRol()))
        );
    }

    /** Login: autentica y devuelve un token JWT */
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword()));

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow();

        String token = jwtUtils.generarToken(usuario.getCorreo());

        return LoginResponse.builder()
                .token(token)
                .tipo("Bearer")
                .correo(usuario.getCorreo())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol().getNombreRol())
                .build();
    }

    /** Registro: crea un nuevo usuario con rol Cliente */
    public UsuarioResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado.");
        }

        Rol rolCliente = rolRepository.findByNombreRol("Cliente")
                .orElseThrow(() -> new IllegalStateException("Rol 'Cliente' no encontrado en BD."));

        Usuario nuevo = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .rol(rolCliente)
                .build();

        Usuario guardado = usuarioRepository.save(nuevo);

        return UsuarioResponse.builder()
                .idUsuario(guardado.getIdUsuario())
                .nombre(guardado.getNombre())
                .correo(guardado.getCorreo())
                .telefono(guardado.getTelefono())
                .rol(guardado.getRol().getNombreRol())
                .build();
    }
}
