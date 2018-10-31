import React from 'react';
import {withRouter} from 'next/router'
import UpdateItem from '../components/UpdateItem';

const Update = ({router: {query}}) => (
	<UpdateItem id={query.id}/>
);

export default withRouter(Update);
