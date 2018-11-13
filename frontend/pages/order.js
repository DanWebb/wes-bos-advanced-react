import React from 'react';
import {withRouter} from 'next/router';
import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = ({router: {query}}) => (
	<PleaseSignIn>
		<Order id={query.id}/>
	</PleaseSignIn>
);

export default withRouter(OrderPage);
