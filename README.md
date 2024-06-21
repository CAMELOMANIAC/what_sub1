# WhatSub

서브웨이 갈때마다 레시피가 기억이 안나시나요?<br/>
매번 레시피 찾으려 블로그나 구글을 탐색하신다면 WhatSub에서 찾아보세요!<br/>
https://master.d1t804crlddkxa.amplifyapp.com/<br/>

## 프로젝트 설명

이 프로젝트는 subway 레시피를 공유하는 사이트를 구현하기 위한 웹프로젝트 입니다.<br/>
next.js(v13)+TypeScript+React-Redux+React-Query+Tailwind-css로 프론트/백 엔드를 구현하였고<br/>
oracle cloud와 mysql로 db를 관리, AWS-Amplify로 배포합니다.<br/>

## 화면구성

![image](https://github.com/CAMELOMANIAC/what_sub1/assets/122772515/4e5e86b6-4ee6-42a0-85b2-9e6d1e650256)
![image](https://github.com/CAMELOMANIAC/what_sub1/assets/122772515/31c2e070-c861-4b25-b1ac-77e0909f838a)
![image](https://github.com/CAMELOMANIAC/what_sub1/assets/122772515/24a4a95a-a64b-4a3e-8e50-650f784030ea)

## 주요기능

레시피 작성, 댓글 작성, 좋아요, 레시피 일일권장섭취량 그래프 작성 등

## 주요 개발 사항

Next.js의 getServerSideProps를 활용하여 초기정보를 불러오도록 하였습니다.<br/>
Next.js의 next/Image로 이미지, next/head로 SEO 최적화 하였습니다.<br/>
TypeScript로 타입 어노테이션을 정의하고 타입을 체크하여 안정성을 높였습니다.<br/>
RESTful API 규약에 최대한 알맞게 설계했습니다.<br/>
React-Redux 라이브러리로 전역 상태를 활용하였습니다.<br/>
React-Query 라이브러리로 통신상태를 관리 하도록 하였습니다.<br/>
Mysql2 라이브러리로 DB와 통신합니다.<br/>
Tailwind css와 styled-component를 활용하여 css를 작성하고 반응형 웹을 구현했습니다.<br/>
nodeMailer 라이브러리로 회원가입 인증메일을 보냅니다.<br/>
Kakao API로 소셜 로그인 기능을 구현하였습니다.<br/>

## How to use it?

프론트/백엔드는 해당 git hub링크로 사용할 수 있습니다.

```
git clone https://github.com/username/repository.git
```

DB는 dockerHub를 통해 이미지화된 DB를 사용할 수 있습니다

```
docker pull beee12/whatsub-db:0.2
```
