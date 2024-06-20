import React from 'react';
import styled from 'styled-components';

const LogoSpan = styled.span<{color?: string; size?: string}>`
	@font-face {
		font-family: 'LogoFont';
		src: url('/font/Subway.ttf') format('truetype');
	}
	font-family: 'LogoFont';
	font-size: ${props => props.size ?? '4rem'};
	color: ${props => props.color ?? 'black'};
`;

const Logo = (props: {size?: string}) => {
	return (
		<span className="mx-4">
			<LogoSpan color="#ffce32" size={props.size}>
				WhaT
			</LogoSpan>
			<LogoSpan color="#009223" size={props.size}>
				SuB
			</LogoSpan>
		</span>
	);
};

export default Logo;
