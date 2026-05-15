package com.expense_tracker.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
                .cors(cors -> cors.configure(http)) // Allow React to connect
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // Allow everyone to see the login paths
                        .anyRequest().authenticated() // Everything else requires a valid Google Token!
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {
                })); // Turn on Google JWT validation

        return http.build();
    }
}
