package com.estate.back.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.estate.back.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/*
▶ Spring Web Security 설정
Basic 인증 미사용
CSRF 정책 미사용
Session 생성 정책 미사용
CORS 정책 (모든 출처 - 모든 메서드 - 모든 패턴 허용)

JwtAuthenticationFilter 추가 (UsernamePasswordAuthenticationFilter 이전에 추가)
*/

// 등록, 수정, web security 설정 지원
@Configurable
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
            // http basic 인증 미사용
            .httpBasic(HttpBasicConfigurer::disable)
            // CSRF 미사용 
            .csrf(CsrfConfigurer::disable)
            // Session 생성 정책 미사용
            .sessionManagement(sessionManagement -> sessionManagement
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // 아래에서 작성한 CORS정책 설정 적용
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // JwtAuthenticationFilter 추가 (UsernamePasswordAuthenticationFilter 이전에 추가)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    // CORS 정책 설정
    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    
}
