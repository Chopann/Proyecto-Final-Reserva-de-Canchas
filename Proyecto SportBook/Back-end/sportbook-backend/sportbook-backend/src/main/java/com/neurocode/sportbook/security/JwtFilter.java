package com.neurocode.sportbook.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extraemos el token JWT del encabezado Authorization.
        String token = extraerTokenDelHeader(request);

        // 2. Si existe token y es válido, autenticamos al usuario en el contexto de seguridad.
        if (token != null && jwtUtils.validarToken(token)) {
            // 2.1. Obtenemos el correo del usuario desde el token.
            String correo = jwtUtils.extraerCorreo(token);
            // 2.2. Cargamos los detalles del usuario para poder validar roles y permisos.
            UserDetails userDetails = userDetailsService.loadUserByUsername(correo);

            // 2.3. Creamos el objeto de autenticación para Spring Security.
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 2.4. Guardamos la autenticación en el contexto de seguridad actual.
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // 3. Continuamos con la cadena de filtros de la aplicación.
        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el token del header Authorization cuando está en el formato:
     * "Authorization: Bearer <token>".
     */
    private String extraerTokenDelHeader(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
