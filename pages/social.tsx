import { useRouter } from "next/router";
import { useEffect } from 'react';

const social = () => {
    const router = useRouter();
    const { code } = router.query;


    return (
        <div>
            잠시만 기다려주세요
            {code}
        </div>
    );
};

export default social;