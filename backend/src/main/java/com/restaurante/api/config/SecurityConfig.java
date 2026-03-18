package com.restaurante.api.config;

import com.restaurante.api.entity.Usuario;
import com.restaurante.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UsuarioRepository usuarioRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/mesas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/ordenes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/debug/**").permitAll()
                        // NOTA: /historial es PROTEGIDO, debe ir ANTES del wildcard público
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/historial").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/cocina/**").hasAnyRole("CHEF", "PARRILLERO", "BARISTA", "REPOSTERO", "ADMIN")
                        .requestMatchers("/api/mesero/**").hasAnyRole("MESERO", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/ordenes/**").hasAnyRole("MESERO", "CHEF", "PARRILLERO", "BARISTA", "REPOSTERO", "ADMIN")
                        .anyRequest().authenticated())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
            String role = "ROLE_" + usuario.getRol().name().toUpperCase();
            return User.builder()
                    .username(usuario.getEmail())
                    .password(usuario.getPasswordHash())
                    .authorities(new SimpleGrantedAuthority(role))
                    .build();
        };
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }
}
