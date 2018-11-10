import React from 'react';
import styled from 'styled-components';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const AnimationStyles = styled.span`
	position: relative;

	.count {
		display: block;
		position: relative;
		transition: all 0.5s;
		backface-visibility: hidden;
	}

	.count-enter {
		transform: rotateX(0.5turn);
	}

	.count-enter-active {
		transform: rotateX(0);
	}

	.count-exit {
		top: 0;
		position: absolute;
		transform: rotateX(0);
	}

	.count-exit-active {
		transform: rotateX(0.5turn);
	}
`;

const Dot = styled.div`
	background: ${props => props.theme.red};
	color: #fff;
	border-radius: 50%;
	padding: 0.5rem;
	line-height: 2rem;
	min-width: 3rem;
	margin-left: 1rem;
	font-weight: 100;
	font-feature-settings: 'tnum';
	font-variant-numeric: tabular-nums;
`;

const CartCount = ({count}) => (
	<AnimationStyles>
		<TransitionGroup>
			<CSSTransition 
				className="count"
				classNames="count"
				key={count}
				timeout={{enter: 500, exit: 500}}
				unmountOnExit
			>
				<Dot>{count}</Dot>
			</CSSTransition>
		</TransitionGroup>
	</AnimationStyles>
);

export default CartCount;
