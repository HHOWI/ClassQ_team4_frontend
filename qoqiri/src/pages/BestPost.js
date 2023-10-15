import '../css/BestPost.css';
import PageNation from '../components/PageNation';
import NavBtn from '../components/NavBtn';
import kkorang from '../assets/kkorang3.jpg';
import { getPosts, getBoards } from '../api/post';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const BestPost = () => {
    const [posts, setPosts] = useState([]);
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(1);
    const [board, setBoard] = useState(null);

    const boardAPI = async () => {
        const result = await getBoards();
        setBoards(result.data);
    };

    const PostAPI = async () => {
        const result = await getPosts(page, board);
        console.log(result.data);
        setPosts([...posts, ...result.data]);
    };

    const boardFilterAPI = async () => {
        const result = await getPosts(page, board);
        setPosts(result.data);
    };
    useEffect(() => {
        boardAPI();
        PostAPI();
    }, []);

    useEffect(() => {
        if (board != null) {
            console.log(board);
            PostAPI();
        }
    }, [board]);

    const filterBoard = (e) => {
        e.preventDefault();
        const href = e.target.href.split('/');
        console.log(href[href.length - 1]);
        setBoard(parseInt(href[href.length - 1]));
        setPage(1);
        setPosts([]);
    };
    return (
        <>
            <article id="list">
                <section id="bestList" className="bestPost" key={posts?.postSEQ}>
                    <div className="item bestlistHeader">
                        <div className="info2">
                            <div className="titleContainer">
                                {/* <div className="categoryContainer">
                                    <span className="ListCategory">카테고리</span>
                                </div> */}
                                <span className="title">
                                    <span className="text1">제목</span>
                                </span>
                            </div>
                            <div className="etc1">
                                <div className="nickName">글쓴이</div>
                                <div className="dot"></div>
                                <div className="datetime field">날짜</div>
                                <div className="dot"></div>
                                <div className="viewCount number">조회</div>
                                <div className="dot"></div>
                                <div className="likeCount number">추천</div>
                            </div>
                        </div>
                    </div>
                    
                    {posts.map((post) => (
                        
                        <div className="item">
                            <a href={`/viewpost/${post.postSEQ}`} className="post">
                                <div className="best">
                                    <div className="titleContainer">
                                        <div className="bestImage">
                                            {/* 여기 이제 url 방식으로 Blob써서 넣어야함 css도 수정 지금 이미지 사이즈랑 베스트글 카테고리 사이즈랑 같이커짐*/}
                                            <img
                                                src={kkorang}
                                                style={{
                                                    maxWidth: '100%',
                                                    height: '30px',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                    borderRadius: '3px',
                                                }}
                                            />
                                        </div>
                                        <div className="category">[베스트글 카테고리]</div>
                                        <div className="title"></div>{' '}
                                        <div className="text">
                                            <div className="pre">{post?.postTitle}</div>
                                            {post?.postContent}
                                        </div>
                                        <div className="commentCount">0</div>
                                    </div>

                                    <div className="etc">
                                        <div className="nickName">
                                            {post?.userInfo.userNickname}
                                            <i className="nicknameIcon"></i>
                                        </div>
                                        <div className="dot"></div>
                                        <div className="datetime">n일전</div>
                                        <div className="dot"></div>
                                        <div className="viewCount">
                                            <i className="viewIcon"></i>뷰
                                        </div>
                                        <div className="dot"></div>
                                        <div className="likeCount">
                                            <i className="like Icon"></i>
                                            👍
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>                     
                    ))}
                </section>
                <NavBtn />
            </article>
            <PageNation />
        </>
    );
};

export default BestPost;
