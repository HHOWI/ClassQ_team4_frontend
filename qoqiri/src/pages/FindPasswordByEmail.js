import React, { useState } from "react";

export default function FindPasswordByEmail() {
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);

        if (e.target.value.includes('@')) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();


    };

    return (
        <div>
            <br></br>
            <br></br>
            <h2>비밀번호 찾기</h2>
            <br></br>
            <form onSubmit={onSubmit}>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        placeholder="이메일 입력"
                        value={email}
                        onChange={handleEmail}
                    />
                </div>
                <div>
                    {!emailValid && email.length > 0 && <div>올바른 이메일 형식이 아닙니다.</div>}
                </div>
                <br></br>
                <br></br>
                <div>
                    <button type="submit" disabled={!emailValid}>
                        비밀번호 재설정 이메일 보내기
                    </button>
                </div>
                <br></br>
                <br></br>
            </form>
        </div>
    );
}
