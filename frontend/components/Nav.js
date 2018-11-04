import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
	<User>
		{({data: {me}}) => (
			<NavStyles>
				<Link href="/items"><a>shop</a></Link>
				{me ? (
					<>
						<Link href="/sell"><a>sell</a></Link>
						<Link href="/orders"><a>orders</a></Link>
						<Link href="/account"><a>account</a></Link>
						<Signout/>
					</>
				) : (
					<Link href="/signup"><a>signup</a></Link>
				)}

			</NavStyles>
		)}
	</User>
);

export default Nav;
