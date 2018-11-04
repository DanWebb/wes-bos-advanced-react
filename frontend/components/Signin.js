import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {CURRENT_USER_QUERY} from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
	mutation SIGNIN_MUTATION($email: String!, $password: String!) {
		signin(email: $email, password: $password) {
			id
			name
			email
		}
	}
`;

class Signin extends Component {
	state = {
		password: '',
		email: ''
	}

	handleChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}

	handleSubmit = async (e, signin) => {
		e.preventDefault();
		await signin();
		this.setState({password: '', email: ''});
	}

	render() { 
		return (
			<Mutation
				mutation={SIGNIN_MUTATION}
				refetchQueries={[{query: CURRENT_USER_QUERY}]}
				variables={this.state}
			>
				{(signin, {loading, error}) => (
					<Form method="post" onSubmit={e => this.handleSubmit(e, signin)}>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Sign in to your an account</h2>
							<Error error={error}/>
							<label htmlFor="email">
								email
								<input 
									type="email" 
									name="email" 
									placeholder="email" 
									value={this.state.email} 
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor="password">
								password
								<input 
									type="password" 
									name="password" 
									placeholder="password" 
									value={this.state.password} 
									onChange={this.handleChange}
								/>
							</label>

							<button type="submit">Sign In</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export {SIGNIN_MUTATION};
export default Signin;