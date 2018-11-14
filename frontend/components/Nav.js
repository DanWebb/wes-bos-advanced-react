import React from 'react';
import Link from 'next/link';
import {Mutation} from 'react-apollo';
import calcTotalQuantity from '../lib/calcTotalQuantity';
import {TOGGLE_CART_MUTATION} from './Cart';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import CartCount from './CartCount';

const Nav = () => (
	<User>
		{({data: {me}}) => (
			<NavStyles data-test="nav">
				<Link href="/items"><a>shop</a></Link>
				{me ? (
					<>
						<Link href="/sell"><a>sell</a></Link>
						<Link href="/orders"><a>orders</a></Link>
						<Link href="/account"><a>account</a></Link>
						<Signout/>
						<Mutation mutation={TOGGLE_CART_MUTATION}>
							{(toggleCart) => (
								<button onClick={toggleCart}>
									Cart
									<CartCount count={calcTotalQuantity(me.cart)}/>
								</button>
							)}
						</Mutation>
					</>
				) : (
					<Link href="/signup"><a>signup</a></Link>
				)}

			</NavStyles>
		)}
	</User>
);

export default Nav;
