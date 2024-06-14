export default function Custom404() {
	return (
		<>
			<article className="w-[500px] p-10 bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg flex flex-col justify-center items-center">
				<div className="w-full flex flex-col my-auto justify-center items-center">
					<h1>잘못된 경로로 접근하였습니다.</h1>
				</div>
			</article>
		</>
	);
}
