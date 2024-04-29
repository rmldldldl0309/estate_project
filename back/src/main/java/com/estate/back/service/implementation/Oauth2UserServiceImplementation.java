package com.estate.back.service.implementation;

import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.estate.back.common.object.CustomAuth2User;
import com.estate.back.entity.EmailAuthNumberEntity;
import com.estate.back.entity.UserEntity;
import com.estate.back.repository.EmailAuthNumberRepository;
import com.estate.back.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Oauth2UserServiceImplementation extends DefaultOAuth2UserService{

    private final UserRepository userRepository;
    private final EmailAuthNumberRepository emailAuthNumberRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        
        // 로그인한 유저 정보 받아옴
        OAuth2User oAuth2User = super.loadUser(userRequest);
        // kakao ? naver ?
        String oauthClientName = 
            userRequest.getClientRegistration().getClientName().toUpperCase();

        // System.out.println(oauthClientName);

        // try {

        //     System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));

        // } catch (Exception exception) {
        //     exception.printStackTrace();
        // }

        String id = getId(oAuth2User, oauthClientName);
        String userId = oauthClientName + "_" + id.substring(0, 10);

        boolean isExistUser = userRepository.existsById(userId);
        if (!isExistUser) {
            String password = passwordEncoder.encode(id);
            String email = id + "@" + oauthClientName.toLowerCase() + ".com";

            EmailAuthNumberEntity emailAuthNumberEntity = new EmailAuthNumberEntity(email, "0000");
            emailAuthNumberRepository.save(emailAuthNumberEntity);

            UserEntity userEntity = new UserEntity(userId, password, email, "ROLE_USER", oauthClientName);
            userRepository.save(userEntity);
        }

        return new CustomAuth2User(userId, oAuth2User.getAttributes());
    }
    private String getId(OAuth2User oAuth2User, String oauthClientName){

        String id =null;

        // {"id":3458613940,"connected_at":"2024-04-29T05:36:42Z","properties":{"nickname":"상헌"},"kakao_account":{"profile_nickname_needs_agreement":false,"profile_image_needs_agreement":true,"profile":{"nickname":"상헌","is_default_nickname":false}}}
        if (oauthClientName.equals("KAKAO")) {
            Long longId = (Long) oAuth2User.getAttributes().get("id");
            id = longId.toString();
        }
        // {"resultcode":"00","message":"success","response":{"id":"8J9Yser_dEG03iwC1-D40ydsZ_owpNeFp7CGpo44AV0","nickname":"상헌","profile_image":"https://ssl.pstatic.net/static/pwe/address/img_profile.png","name":"김상헌"}}
        if (oauthClientName.equals("NAVER")){
            Map<String, String> response = (Map<String, String>) oAuth2User.getAttributes().get("response");
            id = response.get("id");
        }

        return id;
    }
}
