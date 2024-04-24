package com.estate.back.dto.response.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.estate.back.dto.response.ResponseCode;
import com.estate.back.dto.response.ResponseDto;
import com.estate.back.dto.response.ResponseMessage;

import lombok.Getter;

// 로그인 Response Body DTO

@Getter
public class SignInResponseDto extends ResponseDto{

    private String accessToken;
    private int expires;
    
    private SignInResponseDto(String accessToken) {
        // ResponseDto에 기본생성자가 아닌 AllargsConstrutor로 생성자 생성되어있기 떄문에 super
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.accessToken = accessToken;
        this.expires = 10 * 60 * 60; // 10시간을 초단위로
    }

    public static ResponseEntity<SignInResponseDto> success(String accessToken) {
        SignInResponseDto responseBody = new SignInResponseDto(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

}
