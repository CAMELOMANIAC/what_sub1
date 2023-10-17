import {useState,useEffect} from 'react';

const LoginModal = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000`
    const [content, setContent] = useState('');

  useEffect(() => {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        setContent(data);
      })
      .catch(error => console.error(error));
  }, [url]);

  return (
    <div className='absolute w-300px h-600px mx-auto my-auto' dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default LoginModal;