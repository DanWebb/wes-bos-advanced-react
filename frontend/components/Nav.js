import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => (
	<NavStyles>
		<User>{({data: {me}}) => me && <p>{me.name}</p>}</User>
		<Link href="/items"><a>shop</a></Link>
		<Link href="/sell"><a>sell</a></Link>
		<Link href="/signup"><a>signup</a></Link>
		<Link href="/orders"><a>orders</a></Link>
		<Link href="/account"><a>account</a></Link>
	</NavStyles>
);

export default Nav;
