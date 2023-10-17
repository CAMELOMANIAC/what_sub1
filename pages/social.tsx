import { useRouter } from "next/router";
import { useEffect } from 'react';

const social = () => {
    const router = useRouter();
    const { code } = router.query;

    useEffect(() => {
        if (code !== '') {
            router.push('/');
            fetch('/api/socialLogIn', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('응답 데이터:', data);
                })
                .catch(error => {
                    console.error('에러:', error);
                });
                console.log(code);
        }
    }, [router.query])


    return (
        <div>
            잠시만 기다려주세요
            {code}
        </div>
    );
};

export default social;