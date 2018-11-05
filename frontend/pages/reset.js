import React from 'react';
import {withRouter} from 'next/router';
import Reset from '../components/Reset';

const ResetPassword = ({router: {query}}) => (
	<Reset resetToken={query.resetToken}/>
);

export default withRouter(ResetPassword);
