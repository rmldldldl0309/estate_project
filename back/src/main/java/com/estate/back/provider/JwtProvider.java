package com.estate.back.provider;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/*
▶ JWT 생성 및 검증 및 기능 제공자
- JWT 암호화 알고리즘 : HS256
- 비밀키 : 환경변수에 있는 jwt.secret-key
- JWT 만료 기간 : 10시간 () // TODO (이후 1시간)
 */

@Component
public class JwtProvider {

    @Value("${jwt.secret-key}")
    private String secretKey;
    
    private Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

    // JWT생성 메서드
    public String create (String userId) {
        // 만료일 = 현재시간 + 10시간
        Date expiredDate = Date.from(Instant.now().plus(10, ChronoUnit.HOURS));

        // JWT 생성
        String jwt = Jwts.builder()
            .signWith(key, SignatureAlgorithm.HS256)
            // 작성자
            .setSubject(userId)
            // 생성시간
            .setIssuedAt(new Date())
            // 만료시간
            .setExpiration(expiredDate)
            .compact();

        return jwt;
    }

    // JWT검증 메서드
    public String validate (String jwt) {
        String userId = null;

        try {
            userId = 
                // 열쇠 만들기
                Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                // jswt파싱 처리(해체)
                .parseClaimsJws(jwt)
                .getBody()
                .getSubject();
        } catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }
        return userId;
    }

}
