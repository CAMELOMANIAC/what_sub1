import React from 'react';
import { useRouter } from "next/router";

const socialLogIn = () => {
    const router = useRouter()
    router.push(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=http://localhost:3000/api/socialLogIn&client_secret=${process.env.KAKAO_CLIENT_SECRET}`)

    return (
        <div>
            
        </div>
    );
};

export default socialLogIn;