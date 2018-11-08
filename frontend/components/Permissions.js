import React, {Component} from 'react';
import propTypes from 'prop-types';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
	'ADMIN',
	'USER',
	'ITEMCREATE',
	'ITEMUPDATE',
	'ITEMDELETE',
	'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
	query ALL_USERS_QUERY {
		users {
			id
			email
			name
			permissions
		}
	}
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
	mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission]!, $userId: ID!) {
		updatePermissions(permissions: $permissions, userId: $userId) {
			id
			permissions
			name
			email
		}
	}
`

const Permissions = () => (
	<Query query={ALL_USERS_QUERY}>
		{({data, loading, error}) => (
			<div>
				<Error error={error}/>
				<div>
					<h2>Manage Permissions</h2>
					<Table>
						<thead>
							<tr>
								<th>Email</th>
								<th>Name</th>
								{possiblePermissions.map(permission => (
									<th key={permission}>{permission}</th>
								))}
								<th>🚀</th>
							</tr>
						</thead>
						<tbody>
							{data.users.map(user => (
								<User key={user.id} user={user}/>
							))}
						</tbody>
					</Table>
				</div>
			</div>
		)}
	</Query>
);

class User extends Component {
	static propTypes = {
		user: propTypes.shape({
			name: propTypes.string,
			email: propTypes.string,
			id: propTypes.string,
			permissions: propTypes.array
		}).isRequired
	}

	state = {
		permissions: this.props.user.permissions
	}

	handleChange = e => {
		const {value, checked} = e.target;
		this.setState(prevState => {
			let updatedPermissions = [...prevState.permissions];
			if (checked) {
				updatedPermissions.push(value);
			} else {
				updatedPermissions = updatedPermissions.filter(permission => permission !== value);
			}
			return {permissions: updatedPermissions};
		});
	}

	render() {
		const user = this.props.user;
		return (
			<Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{
				permissions: this.state.permissions,
				userId: this.props.user.id
			}}>
				{(updatePermissions, {loading, error}) => (
					<>
						{error && <tr><td colspan="8"><Error error={error}/></td></tr>}
						<tr>
							<td>{user.email}</td>
							<td>{user.name}</td>
							{possiblePermissions.map(permission => (
								<td key={permission}>
									<label htmlFor={`${user.id}-permission-${permission}`}>
										<input
											type="checkbox"
											id={`${user.id}-permission-${permission}`}
											name={permission}
											value={permission}
											checked={this.state.permissions.includes(permission)}
											onChange={this.handleChange}
										/>
									</label>
								</td>
							))}
							<td>
								<SickButton
									type="button"
									disabled={loading}
									onClick={updatePermissions}
								>
									Updat{loading ? 'ing' : 'e'}
								</SickButton>
							</td>
						</tr>
					</>
				)}
			</Mutation>
		)
	}
}

export {UPDATE_PERMISSIONS_MUTATION, ALL_USERS_QUERY}
export default Permissions;
