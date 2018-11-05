import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {CURRENT_USER_QUERY} from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const RESET_PASSWORD_MUTATION = gql`
	mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
		resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
			id
			email
			name
		}
	}
`;

class Reset extends Component {
	state = {
		password: '',
		confirmPassword: ''
	}

	handleChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}

	handleSubmit = async (e, reset) => {
		e.preventDefault();
		await reset();
		this.setState({password: '', confirmPassword: ''});
	}

	render() { 
		return (
			<Mutation
				mutation={RESET_PASSWORD_MUTATION}
				refetchQueries={[{query: CURRENT_USER_QUERY}]}
				variables={{
					resetToken: this.props.resetToken,
					...this.state
				}}
			>
				{(reset, {loading, error, called}) => (
					<Form method="post" onSubmit={e => this.handleSubmit(e, reset)}>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Reset your password</h2>
							<Error error={error}/>
							{!error && !loading && called && (
								<p>Your password has been reset!</p>
							)}
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

							<label htmlFor="password">
								confirm password
								<input 
									type="password" 
									name="confirmPassword" 
									placeholder="confirm password" 
									value={this.state.confirmPassword} 
									onChange={this.handleChange}
								/>
							</label>
							
							<button type="submit">Reset</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export {RESET_PASSWORD_MUTATION};
export default Reset;