import React, {useCallback, useEffect, useState} from 'react';
import {recipeType, replyType} from '../../../interfaces/api/recipes';
import {useMutation, useQuery, useQueryClient} from 'react-query';

type props = {
	recipe: recipeType;
	userName: string;
	className?: string;
};

const ReplySection = ({recipe, className, userName}: props) => {
	const [content, setContent] = useState<string>('');
	const [reply, setReply] = useState<replyType[]>();
	const [isLogin, setIslogin] = useState<boolean>(false);

	//로그인 여부 체크
	const checkLogin = useCallback(() => {
		userName;
	}, [userName]);

	useEffect(() => {
		checkLogin();
		if (userName.length > 0) {
			setIslogin(true);
		}
	}, [checkLogin, userName.length]);

	//댓글 정보를 가져오기위한 쿼리 클라이언트 및 콜백 통신 함수
	const getReply = async ({queryKey}) => {
		const [, recipeId] = queryKey;
		try {
			const response = await fetch(`/api/recipes/${recipeId}/reply`);
			if (response.status === 200) {
				const result: replyType[] = await response.json();
				return result;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const {refetch, data} = useQuery(['reply', recipe.recipe_id], getReply, {
		staleTime: 1000 * 60 * 1,
	});

	useEffect(() => {
		if (data) {
			setReply(data);
		}
	}, [data]);

	const queryClient = useQueryClient();

	useEffect(() => {
		//초기 렌더링시 캐시에 저장된 댓글 불러오기(쿼리키가 존재하면 통신하지 않으므로 직접 상태값에 추가)
		const data: replyType[] | undefined = queryClient.getQueryData([
			'reply',
			recipe.recipe_id,
		]);
		if (data) {
			setReply(data);
		}
	}, [queryClient, recipe.recipe_id]);

	//댓글 등록을 위한 뮤테이션
	const replyMutation = useMutation(
		async ({recipe_id}: {recipe_id: string}) => {
			const response = await fetch(`/api/recipes/${recipe_id}/reply`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: content,
				}),
			});
			if (!response.ok) {
				throw new Error('댓글 등록에 실패 했습니다.');
			}
		},
		{
			onSuccess: () => {
				alert('댓글 등록 성공');
				setContent('');
				refetch(); //댓글 등록 성공시 다시 불러오기
			},
		},
	);

	const insertReply = async () => {
		if (userName.length === 0) {
			alert('로그인 후 이용 가능합니다.');
			return;
		}
		if (content.length === 0) {
			alert('댓글을 입력해주세요');
			return;
		}
		if (content.length > 100) {
			alert('댓글은 100자 이하로 입력해주세요');
			return;
		}
		if (content.length < 1) {
			alert('댓글은 1자 이상 입력해주세요');
			return;
		}
		if (content.includes('<')) {
			alert('태그 사용 불가');
			return;
		}

		replyMutation.mutate({recipe_id: recipe.recipe_id});
	};

	//댓글 삭제 요청 뮤테이션
	const replyDeleteMutation = useMutation(
		async ({replyId}: {replyId: number}) => {
			const response = await fetch(
				`/api/recipes/${recipe.recipe_id}/reply`,
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({replyId: replyId}),
				},
			);
			if (!response.ok) {
				console.log(response);
				throw new Error('댓글 삭제에 실패 했습니다.');
			}
		},
		{
			onSuccess: () => {
				alert('댓글 삭제 성공');
				refetch(); //댓글 삭제 성공시 다시 불러오기
			},
			onError: error => {
				alert('잠시후 다시 시도해주세요' + error);
			},
		},
	);

	//댓글 삭제 여부 이중 확인
	const replyDeleteHandler = (replyId: number) => {
		if (confirm('정말 삭제하시겠습니까?')) {
			replyDeleteMutation.mutate({replyId: replyId});
		}
	};

	return (
		<section className={className}>
			댓글
			<ul className="max-h-48 overflow-y-auto">
				{reply &&
					reply.map((item, index) => (
						<li key={index} className="m-1 border-t-[1px]">
							<p className="font-bold">
								{item.user_table_user_id}
								<button
									className={`${userName === item.user_table_user_id ? 'inline-block' : 'hidden'} font-normal text-red-600 ml-2`}
									onClick={() =>
										replyDeleteHandler(item.reply_id)
									}>
									댓글삭제
								</button>
							</p>{' '}
							{item.reply_context}
						</li>
					))}
			</ul>
			<div className="flex m-1">
				<textarea
					rows={3}
					placeholder={
						isLogin
							? '바르고 고운 말로 생각을 표현해주세요'
							: '로그인이 필요한 기능입니다'
					}
					maxLength={80}
					className="w-5/6 resize-none border-t-[1px]"
					value={content}
					onChange={e => {
						setContent(e.target.value);
					}}></textarea>
				<button
					type="submit"
					className="w-1/6 grow rounded-lg bg-green-600 text-white"
					onClick={insertReply}>
					댓글 작성
				</button>
			</div>
		</section>
	);
};

export default ReplySection;
