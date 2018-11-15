import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!) {
		requestReset(email: $email) {
			message
		}
	}
`;

class RequestReset extends Component {
	state = {
		email: ''
	}

	handleChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}

	handleSubmit = async (e, reset) => {
		e.preventDefault();
		await reset();
		this.setState({email: ''});
	}

	render() { 
		return (
			<Mutation
				mutation={REQUEST_RESET_MUTATION}
				variables={this.state}
			>
				{(reset, {loading, error, called}) => (
					<Form method="post" data-test="form" onSubmit={e => this.handleSubmit(e, reset)}>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Request a password reset {called}</h2>
							<Error error={error}/>
							{!error && !loading && called && (
								<p>Check your email for a reset link!</p>
							)}
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
							
							<button type="submit">Reset</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export {REQUEST_RESET_MUTATION};
export default RequestReset;