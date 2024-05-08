package com.estate.back.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.estate.back.dto.response.ResponseDto;

// Request의 데이터 유효성 검사에서 발생하는 예외 처리

@RestControllerAdvice
public class CustomExceptionHandler {
    
    // RequestBody의 데이터 유효성 검사 중 발생하는 예외 핸들링
    // - MethodArgumentNotValidException : 유효하지 않은 데이터
    // - HttpMessageNotReadableException : RequestBody가 없어서 유효성 검사를 못할 때
    @ExceptionHandler({
        MethodArgumentNotValidException.class,
        HttpMessageNotReadableException.class
    })
    public ResponseEntity<ResponseDto> validationExceptionHandler(
        Exception exception
    ) {
        exception.printStackTrace();
        return ResponseDto.validationFailed();
    }

    // 404처리
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ResponseDto> noHandlerFoundExceptionHandler (
        Exception exception
    ) {
        exception.printStackTrace();
        return ResponseDto.notFound();
    }

}

/*
응답 : 실패 (필수 데이터 미입력)
HTTP/1.1 400 Bad Request
Content Type: application/json;charset=UTF-8
{
    "code": "VF"
    "message": "Validation Failed"
}

- {}: ResponseDto
- 전체 : ResponseEntity
 */
