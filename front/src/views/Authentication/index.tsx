import React, { ChangeEvent, useState } from 'react'
import './style.css'

import SignInBackground from 'src/assets/img/sign-in-background.png'
import SignUpBackground from 'src/assets/img/sign-up-background.png'
import InputBox from 'src/components/Inputbox';

type AuthPage = 'sign-in' | 'sign-up';

interface SnsContainerProps {
    title: string;
}

function SnsContainer ({title}: SnsContainerProps) {

    const onSnsButtonClickHandler = (type: 'kakao' | 'naver') => {
        alert(type);
    };

    return(
        <div className='authentication-sns-container'>
            <div className='sns-container-title label'>{title}</div>
            <div className='sns-button-container'>
                <div className='sns-button kakao-button' onClick={() => onSnsButtonClickHandler('kakao')}></div>
                <div className='sns-button naver-button' onClick={() => onSnsButtonClickHandler('naver')}></div>
            </div>
        </div>
    );
};

interface Props {
    // 함수의 타입 선언 시 > 화살표 함수로 매개변수 + 리턴 값 입력
    onLinkClickHandler: () => void;
}

//                  component                   //
function SignIn ({onLinkClickHandler}: Props) {

    //                  state                   //
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [message, setMessage] = useState<string>('');

    //                  event handler                   //
    //                                                 input에 대한 change 이벤트 발생 시
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
        setMessage('');
    };
    
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setMessage('');
    };

    const onSignInButtonClickHandler = () => {
        const ID = 'service1234';
        const PASSWORD = 'qwe1234';

        const isSuccess = id === ID && password ===PASSWORD;
        if (isSuccess) {
            setId('');
            setPassword('');
            alert('성공');
        } 
        else {
            setMessage('로그인 정보가 일치하지 않습니다');
        }

    };

    //                  render                  //
    return(
        <div className='authentication-contents'>
            <div className='authentication-input-container'>
                <InputBox label='아이디' type='text' value={id} placeholder='아이디를 입력해주세요' onChangeHandeler={onIdChangeHandler}/>
                <InputBox label='비밀번호' type='password' value={password} placeholder='비밀번호를 입력해주세요' onChangeHandeler={onPasswordChangeHandler} message={message} error/>
            </div>
            <div className='authentication-button-container'>
                <div className="primary-button full-width" onClick={onSignInButtonClickHandler}>로그인</div>
                <div className="text-link" onClick={onLinkClickHandler}>회원가입</div>
            </div>
            <div className='short-divider'></div>
            <SnsContainer title='sns 로그인'/>
        </div>
    )
}

//                  component                   
function SignUp ({onLinkClickHandler}: Props) {

    //                  state                    // 
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>("");
    const [passwordCheck, setpasswordCheck] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [num, setNum] = useState<string>("");

    const [idButtonStatus, setidButtonStatus] = useState<boolean>(false);
    const [emailButtonStatus, setEmailButtonStatus] = useState<boolean>(false);
    const [numButtonStatus, setNumButtonStatus] = useState<boolean>(false);

    const [isIdCheck, setIdCheck] = useState<boolean>(false);
    const [isPasswordPattern, setPasswordPattern] = useState<boolean>(false);
    const [isEqualPassword, setEqualPassword] = useState<boolean>(false);
    const [isEmailCheck, setEmailCheck] = useState<boolean>(false);
    const [isNumCheck, setNumCheck] = useState<boolean>(false);

    const isSignUpActive = isIdCheck && isEmailCheck && isNumCheck && isPasswordPattern && isEqualPassword;

    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [numMessage, setNumMessage] = useState<string>('');

    const [isIdError, setIdError] = useState<boolean>(false);
    const [isEmailError, setEmailError] = useState<boolean>(false);
    const [isNumError, setNumError] = useState<boolean>(false);

    const signUpButtonClass = isSignUpActive ? 'primary-button full-width' : 'disable-button full-width';
    // const signUpButtonClass = (isSignUpActive ? 'primary' : 'disable') + '-button full-width';
    // const signUpButtonClass = isSignUpActive ? `${isSignUpActive ? 'primary' : 'disable'}-button full-width`

    //                  event Handler                   //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setId(value);
        setidButtonStatus(value !== '');
        setIdCheck(false);
        setIdMessage('');
    };
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPassword(value);
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isPasswordPattern = passwordPattern.test(value);
        setPasswordPattern(isPasswordPattern);
        const passwordMessage = 
            isPasswordPattern ? '' : value ? '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요' : '';
        setPasswordMessage(passwordMessage);

    };
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setpasswordCheck(value);
        const isEqualPassword = password === value;

        setEqualPassword(isEqualPassword);
        const passwordCheckMessage = 
            isEqualPassword ? '' : value ? '비밀번호가 일치하지 않습니다.' : '';
        setPasswordCheckMessage(passwordCheckMessage);
    };
    const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setEmail(value);
        setEmailButtonStatus(value !== '');
        setEmailCheck(false);
        setNumCheck(false);
        setEmailMessage('')
    };
    const onNumChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setNum(value);
        setNumButtonStatus(value !== '');
        setNumCheck(false);
        setNumMessage('');
    };

    const onIdButtonClickHandler = () => {
        if (!idButtonStatus) return;

        const idCheck = id !== 'admin';
        setIdCheck(idCheck);
        setIdError(!idCheck);

        const idMessage = idCheck ? '사용 가능한 아이디 입니다.' : '이미 사용중인 아이디 입니다.'
        setIdMessage(idMessage);
    }
    const onEmailButtonClickHandler = () => {
        if (!emailButtonStatus) return;

        const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,3}$/;
        const isEmailPattern = emailPattern.test(email);
        setEmailCheck(isEmailPattern);
        setEmailError(!isEmailPattern);

        const emailMessage = isEmailPattern ? '인증번호가 전송되었습니다.' : '이메일 형식이 아닙니다.';
        setEmailMessage(emailMessage);
    }
    const onNumButtonClickHandler = () => {
        if (!numButtonStatus) return;
        
        const numCheck = num === '1234';
        setNumCheck(numCheck);
        setNumError(!numCheck);

        const numMessage = numCheck ? '인증번호가 확인되었습니다.' : '인증번호가 일치하지 않습니다';
        setNumMessage(numMessage);
    }

    const onSignInButtonClickHandler = () => {
        if(!isSignUpActive) return;
        alert('회원가입');
    };

    //                  render                  //
    return (
        <div className='authentication-contents'>
            <SnsContainer title='SNS 회원가입'/>
            <div className='short-divider'></div>
            <div className='authentication-input-container'>

                <InputBox label='아이디' type='text' value={id} placeholder='아이디를 입력해주세요' onChangeHandeler={onIdChangeHandler} buttonTitle='중복 확인' 
                buttonStatus={idButtonStatus} onIdButtonClickHandler={onIdButtonClickHandler} message={idMessage} error={isIdError}/>

                <InputBox label='비밀번호' type='password' value={password} placeholder='비밀번호를 입력해주세요' 
                onChangeHandeler={onPasswordChangeHandler} message={passwordMessage} error/>

                <InputBox label='비밀번호 확인' type='password' value={passwordCheck} placeholder='비밀번호를 입력해주세요' onChangeHandeler={onPasswordCheckChangeHandler} message={passwordCheckMessage} error/>

                <InputBox label='이메일' type='text' value={email} placeholder='이메일 주소를 입력해주세요' onChangeHandeler={onEmailChangeHandler} buttonTitle='이메일 인증'
                buttonStatus={emailButtonStatus} onIdButtonClickHandler={onEmailButtonClickHandler} message={emailMessage} error={isEmailError}/>

                {
                isEmailCheck &&
                <InputBox label='인증번호' type='text' value={num} placeholder='인증번호 4자리를 입력해주세요' onChangeHandeler={onNumChangeHandler} 
                buttonTitle='인증 확인' buttonStatus={numButtonStatus} onIdButtonClickHandler={onNumButtonClickHandler} message={numMessage} error={isNumError}/>
                }

            </div>
            <div className='authentication-button-container'>
                <div className={signUpButtonClass} onClick={onSignInButtonClickHandler}>회원가입</div>
                <div className="text-link" onClick={onLinkClickHandler}>로그인</div>
            </div>
        </div>
    )
}

//                  component                   //
export default function Authentication () {

    //                  state                   //
    // use- 함수 = 훅함수 > 반드시 컴포넌트 바로 아래에 선언되어 있어야 한다
    const [page, setPage] = useState<AuthPage>('sign-in');

    //                  event handler                   //
    const onLinkClickHandler = () => {
        if (page === 'sign-in') setPage('sign-up');
        else setPage('sign-in');
    }

    const AuthenticationContents = page === 'sign-in' ? <SignIn onLinkClickHandler={onLinkClickHandler}/> : <SignUp onLinkClickHandler={onLinkClickHandler}/>;

    const imageboxStyle = {backgroundImage: `url(${page === 'sign-in' ? SignInBackground : SignUpBackground})`};

    //                  render                  //
    return (
        <div id='authentication-wrapper'>
            <div className='authentication-image-box' style={imageboxStyle}></div>
            <div className='authentication-box'>
                <div className='authentication-container'>
                    <div className='authentication-title h1'>{'임대 주택 가격 서비스'}</div>
                    {AuthenticationContents}
                </div>
            </div>
        </div>
    )
}
