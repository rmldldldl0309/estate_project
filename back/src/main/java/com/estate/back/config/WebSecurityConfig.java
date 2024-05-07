package com.estate.back.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.estate.back.filter.JwtAuthenticationFilter;
import com.estate.back.handler.OAuth2SuccessHandler;
import com.estate.back.service.implementation.Oauth2UserServiceImplementation;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private final Oauth2UserServiceImplementation oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

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
            // white list 작업 / 요청에 대해 지정한 인원들에게만 권한 부여
            .authorizeHttpRequests(request -> request
                .requestMatchers("/", "/api/v1/auth/**", "/oauth2/callback/*").permitAll()
                .requestMatchers("api/v1/board/").hasRole("USER")
                .requestMatchers("api/v1/board/*/comment").hasRole("ADMIN")
                .anyRequest().authenticated()
                )

            .oauth2Login(oauth2 -> oauth2
                // 요청에 대한 주소
                .authorizationEndpoint(endpoint -> endpoint.baseUri("/api/v1/auth/oauth2"))
                // 콜백 받을 주소
                .redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/callback/*"))
                // 정보를 받을 방법
                .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
                // 
                .successHandler(oAuth2SuccessHandler)
            )
            // 인증 및 인가 실패 > AF
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(new AuthorizationFailedEntryPoint())
            )
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

class AuthorizationFailedEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN); 
        response.getWriter().write("{ \"code\":\"AF\",\"message\":\"Authorization Failed\" }");

    }
    
}
