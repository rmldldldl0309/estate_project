import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css'
import { useUserStore } from 'src/stores';
import { useNavigate } from 'react-router';
import { AUTH_ABSOULUTE_PATH, COUNT_PER_PAGE, COUNT_PER_SECTION, QNA_DETAIL_ABSOLUTE_PATH, QNA_LIST_ABSOLUTE_PATH, QNA_WRITE_ABSOLUTE_PATH } from 'src/constant';
import { BoardListItem } from 'src/types';
import { GetSearchBoardListRequest, getBoardListRequest } from 'src/apis/board';
import { useCookies } from 'react-cookie';
import ResponseDto from 'src/apis/response.dto';
import { GetBoardListResponseDto, GetSearchBoardListResponseDto } from 'src/apis/board/dto/response';

//              component                   //
function ListItem ({receptionNumber, status, title, writerId, writeDateTime, viewCount}: BoardListItem) {

    //                  function                    //
    const navigator = useNavigate();

    //                  event handler                   //
    const onClickHandler = () => {
        navigator(QNA_DETAIL_ABSOLUTE_PATH(receptionNumber));
    }

    //                  render                  //
    return (
        <div className='qna-list-table-tr' onClick={onClickHandler}>
            <div className='qna-list-table-reception-number'>{receptionNumber}</div>
            <div className='qna-list-table-status'>
                {status ? 
                    <div className='disable-bedge'>완료</div> :
                    <div className='primary-bedge'>접수</div>
                }
            </div>
            <div className='qna-list-table-title' style={{ textAlign: 'left' }}>{title}</div>
            <div className='qna-list-table-writer-id'>{writerId}</div>
            <div className='qna-list-table-writer-id'>{writeDateTime}</div>
            <div className='qna-list-table-viewcount'>{viewCount}</div>
        </div>
    )
}


//              component                   //
export default function QnaList() {

    //                  state                  //
    const {loginUserRole} = useUserStore();

    const [cookies] = useCookies();
    /*
    페이지당 게시물 : 10
    섹션당 페이지 수 : 10

    총 게시물 수 : 316
    총 페이지 수 : 32 ((총게시물-1) // 한페이지 당 게시물 수) + 1
    총 섹션 수 : 4 ((총페이지수-1) // 한섹션 당 페이지수) + 1

    페이지에 띄워줄 게시물 번호 : (페이지 - 1) * 10 ~ [페이지*10 - 1 / 맨 마지막 페이지]
    섹션 당 가지는 페이지 번호 : (섹션 * 섹션당페이지수 - (섹션당페이지수 - 1)) ~ 섹션 * 섹션당 페이지수 / 마지막 페이지
    */

    // 전체 리스트
    const [boardList, setBoardList] = useState<BoardListItem[]>([]);
    // 한 페이지에서 보여줄 리스트
    const [viewList, setViewList] = useState<BoardListItem[]>([]);

    const [totalLength, setTotalLength] = useState<number>(0);

    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [pageList, setPageList] = useState<number[]>([]);

    const [totalSection, setTotalSection] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);

    const [isToggleOn, setToggleOn] = useState<boolean>(false);

    const [searchWord, setSearchWord] = useState<string>('');

    //                  function                  //
    const navigator = useNavigate();

    const changePage = (boardList: BoardListItem[], totalLength: number) => {
        const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
        let endIndex = currentPage * COUNT_PER_PAGE;
        if (endIndex > totalLength - 1) endIndex = totalLength;
        const viewList = boardList.slice(startIndex, endIndex);
        setViewList(viewList);
    }

    const changeSection = (totalPage: number) => {
        const startPage = currentSection * COUNT_PER_SECTION - (COUNT_PER_SECTION - 1)
        let endPage = currentSection * COUNT_PER_SECTION
        if (endPage > totalPage) endPage = totalPage
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page ++) pageList.push(page);
        setPageList(pageList);
    }

    const changeBoardList = (boardList: BoardListItem[]) => {
        setBoardList(boardList);

        const totalLength = boardList.length;
        setTotalLength(totalLength);

        // 총 페이지 수 : ((총게시물-1) // 한페이지 당 게시물 수) + 1
        const totalPage = Math.floor((totalLength - 1) / COUNT_PER_PAGE) + 1
        setTotalPage(totalPage);

        // 총 섹션 수 : ((총페이지수-1) // 한섹션 당 페이지수) + 1
        const totalSection = Math.floor((totalPage - 1) / COUNT_PER_SECTION) + 1
        setTotalSection(totalSection);

        // 페이지에 띄워줄 게시물 번호 : (페이지 - 1) * 10 ~ [페이지*10 - 1 / 맨 마지막 페이지]
        changePage(boardList, totalLength);
        // 섹션 당 가지는 페이지 번호 : (섹션 * 섹션당페이지수 - (섹션당페이지수 - 1)) ~ 섹션 * 섹션당 페이지수 / 마지막 페이지
        changeSection(totalPage);
    }

    const getBoardListResponse = (result: GetBoardListResponseDto | ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다' : '';
        
        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') navigator(AUTH_ABSOULUTE_PATH);
            return;
        }

        const {boardList} = result as GetBoardListResponseDto;
        changeBoardList(boardList);
    }

    const getSearchBoardListResponse = (result: GetSearchBoardListResponseDto | ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '검색어를 입력하세요.' :
            result.code === 'AF' ? '인증에 실패했습니다.' : 
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        if (!result || result.code !== 'SU') {
            alert(message);
            if(result?.code === 'AF') navigator(AUTH_ABSOULUTE_PATH);
            return;
        }

        const {boardList} = result as GetSearchBoardListResponseDto;
        changeBoardList(boardList);
        setCurrentPage(1);
        setCurrentSection(1);
    }
    
    //                  event handler                  //
    const onRightButtonClickHandler = () => {
        if (loginUserRole !== 'ROLE_USER') return;
        navigator(QNA_WRITE_ABSOLUTE_PATH)
    }

    const onToggleClickHandler = () => {
        if (loginUserRole !== 'ROLE_ADMIN') return;
        setToggleOn(!isToggleOn);
    }

    const onPageClickHandler = (page: number) => {
        setCurrentPage(page)
    }

    const onPreSectionClickHandler = () => {
        if (currentSection === 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * COUNT_PER_SECTION)
    }

    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * COUNT_PER_SECTION + 1)
    }

    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const searchWord = event.target.value;
        setSearchWord(searchWord);
    }

    const onSearchButtonClickHandler = () => {
        if (!searchWord) return;
        if (!cookies.accessToken) return;
        
        GetSearchBoardListRequest(searchWord, cookies.accessToken).then(getSearchBoardListResponse);
    }

    //                  effect                  //
    useEffect(() => {
        if (!cookies.accessToken) return;
        getBoardListRequest(cookies.accessToken).then(getBoardListResponse)
    }, [])

    useEffect(() => {
        if (!boardList.length) return;
        changePage(boardList, totalLength);
    }, [currentPage])

    useEffect(() => {
        if (!boardList.length) return;
        changeSection(totalPage)
    }, [currentSection])

    //                  render                  //
    const toggleClass = isToggleOn ? 'toggle-active' : 'toggle';
    const searchButtonClass = searchWord ? 'primary-button' : 'disable-button';
    return (
        <div id='qna-list-wrapper'>
            <div className='qna-list-top'>
                <div className='qna-list-size-text'>전체 <span className='emphasis'>{totalLength}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span></div>
                <div className='qna-list-top-right'>
                    {loginUserRole === 'ROLE_USER' ? <div className='primary-button' onClick={onRightButtonClickHandler}>글쓰기</div> : 
                    <>
                        <div className={toggleClass} onClick={onToggleClickHandler}></div>
                        <div className='qna-list-top-admin-text'>미완료 보기</div>
                    </>
                    }   
                    
                </div>
            </div>

            <div className='qna-list-table'>
                <div className='qna-list-table-th'>
                    <div className='qna-list-table-reception-number'>접수번호</div>
                    <div className='qna-list-table-status'>상태</div>
                    <div className='qna-list-table-title'>제목</div>
                    <div className='qna-list-table-writer-id'>작성자</div>
                    <div className='qna-list-table-writer-id'>작성일</div>
                    <div className='qna-list-table-viewcount'>조회수</div>
                </div>
                {viewList.map(item => <ListItem {...item}/>)}
            </div>

            <div className='qna-list-bottom'>
                <div style={{width: '299px'}}></div>
                <div className='qna-list-pagenation'>
                    <div className='qna-list-page-left' onClick={onPreSectionClickHandler}></div>
                    <div className='qna-list-page-box'>
                        {pageList.map(page => 
                            page === currentPage ?
                            <div className='qna-list-page-active'>{page}</div> :
                            <div className='qna-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
                        )} 
                    </div>
                    <div className='qna-list-page-right' onClick={onNextSectionClickHandler}></div>
                </div>  
                <div className='qna-list-search-box'>
                    <div className='qna-list-search-input-box'>
                        <input className='qna-list-search-input' placeholder='검색어를 입력하세요.' value={searchWord} onChange={onSearchWordChangeHandler}/>
                    </div>
                    <div className={searchButtonClass} onClick={onSearchButtonClickHandler}>검색</div>
                </div>
            </div>
        </div>
    )
}
