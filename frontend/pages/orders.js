import React from 'react';
import PleaseSignIn from '../components/PleaseSignIn';
import Orders from '../components/Orders';

const OrdersPage = () => (
	<PleaseSignIn>
		<Orders/>
	</PleaseSignIn>
);

export default OrdersPage;
