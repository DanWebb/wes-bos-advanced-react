import React from 'react';
import {withRouter} from 'next/router';
import SingleItem from '../components/SingleItem';

const Item = ({router: {query}}) => (
	<SingleItem id={query.id}/>
);

export default withRouter(Item);
