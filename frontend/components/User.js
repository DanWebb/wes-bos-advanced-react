import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import propTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
	query CURRENT_USER_QUERY {
		me {
			id
			email
			name
			permissions
			orders {
				id
			}
			cart {
				id
				quantity
				item {
					id
					title
					price
					image
					description
				}
			}
		}
	}
`;

const User = props => (
	<Query {...props} query={CURRENT_USER_QUERY}>
		{payload => props.children(payload)}
	</Query>
);

User.propTypes = {
	children: propTypes.func.isRequired
};

export {CURRENT_USER_QUERY};
export default User;