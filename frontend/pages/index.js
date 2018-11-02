import React from 'react';
import {withRouter} from 'next/router';
import Items from '../components/Items';

const Home = ({router: {query}}) => (
	<div>
		<Items page={Number(query.page) || 1}/>
	</div>
);

export default withRouter(Home);
