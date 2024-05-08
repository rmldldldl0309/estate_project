package com.estate.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.estate.back.dto.request.board.PostBoardRequestDto;
import com.estate.back.dto.request.board.PostCommentRequestDto;
import com.estate.back.dto.request.board.PutBoardRequestDto;
import com.estate.back.dto.response.ResponseDto;
import com.estate.back.dto.response.board.GetBoardListResponseDto;
import com.estate.back.dto.response.board.GetBoardResponseDto;
import com.estate.back.dto.response.board.GetSearchBoardListResponseDto;
import com.estate.back.service.BoardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping("/")
    public ResponseEntity<ResponseDto> postBoard (
        @RequestBody @Valid PostBoardRequestDto requestBody, 
        // filter를 거친 context내의 userId
        @AuthenticationPrincipal String userId
    ) {
        ResponseEntity<ResponseDto> response = boardService.postBoard(requestBody, userId);
        return response;
    }

    @GetMapping("/list")
    public ResponseEntity<? super GetBoardListResponseDto> getBoardList () {
        ResponseEntity<? super GetBoardListResponseDto> response = boardService.getBoardList();
        return response;
    }

    // /list/{searchWord} >> 형태로 했을 때 ? . # 등의 문자들 사용 X
    @GetMapping("/list/search")
    public ResponseEntity<? super GetSearchBoardListResponseDto> getSearchBoardList (
        @RequestParam("word") String word
    ) {
        ResponseEntity<? super GetSearchBoardListResponseDto> response = boardService.getSearchBoardList(word);
        return response;
    }

    @GetMapping("/{receptionNumber}")
    public ResponseEntity<? super GetBoardResponseDto> getBoard (
        @PathVariable("receptionNumber") int receptionNumber
    ) {
        ResponseEntity<? super GetBoardResponseDto> response = boardService.getBoard(receptionNumber);
        return response;
    }

    @PutMapping("/{receptionNumber}")
    public ResponseEntity<ResponseDto> putBoard (
        @RequestBody @Valid PutBoardRequestDto requestbody, 
        @PathVariable("receptionNumber") int receptionNumber, 
        @AuthenticationPrincipal String userId
    ) {
        ResponseEntity<ResponseDto> response = boardService.putBoard(requestbody, receptionNumber, userId);
        return response; 
    }

    @PatchMapping("/{receptionNumber}/increase-view-count") 
    public ResponseEntity<ResponseDto> increaseViewCount (
        @PathVariable("receptionNumber") int receptionNumber
    ) {
        ResponseEntity<ResponseDto> response = boardService.increaseViewCount(receptionNumber);
        return response;
    }

    @PostMapping("/{receptionNumber}/comment")
    public ResponseEntity<ResponseDto> postComment(
        @RequestBody @Valid PostCommentRequestDto requestbody, 
        @PathVariable("receptionNumber") int receptionNumber
    ) {     
        ResponseEntity<ResponseDto> response = boardService.postComment(requestbody, receptionNumber);
        return response;
    }

    @DeleteMapping("/{receptionNumber}")
    public ResponseEntity<ResponseDto> deleteBoard(
        @PathVariable("receptionNumber") int receptionNumber, 
        @AuthenticationPrincipal String userId
    ) {
        ResponseEntity<ResponseDto> response = boardService.deleteBoard(receptionNumber, userId);
        return response;
    }

}
