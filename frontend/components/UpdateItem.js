import React, {Component} from 'react';
import {Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import formatMoney from '../lib/formatMoney';
import Form from './styles/Form';
import Error from '../components/ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: {id: $id}) {
			id
			title
			description
			price
		}
	}
`;
const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION(
		$id: ID!
		$title: String 
		$description: String 
		$price: Int
	) {
		updateItem(
			id: $id
			title: $title 
			description: $description 
			price: $price 
		) {
			id
			title
			description 
			price
		}
	}
`;

class UpdateItem extends Component {
	state = {}

	handleChange = e => {
		const {name, type, value} = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({[name]: val});
	}

	handleSubmit = async (e, updateItem) => {
		e.preventDefault();
		const response = await updateItem({variables: {
			id: this.props.id,
			...this.state
		}});

	}

	render() { 
		return (
			<Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
				{({data, loading}) => {
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No data found for {this.props.id}</p>
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION}>
							{(updateItem, {loading, error}) => (
								<Form onSubmit={e => this.handleSubmit(e, updateItem)}>
									<Error error={error}/>
									<fieldset disabled={loading} aria-busy={loading}>
										<label htmlFor="title">
											Title
											<input
												required
												type="text"
												id="title"
												name="title"
												placeholder="Title"
												defaultValue={data.item.title}
												value={this.state.title}
												onChange={this.handleChange}
												/>
										</label>

										<label htmlFor="price">
											Price
											<input
												required
												type="number"
												id="price"
												name="price"
												placeholder="Price"
												defaultValue={data.item.price}
												value={this.state.price}
												onChange={this.handleChange}
												/>
										</label>

										<label htmlFor="description">
											Description
											<textarea
												required
												id="description"
												name="description"
												placeholder="Description"
												defaultValue={data.item.description}
												value={this.state.description}
												onChange={this.handleChange}
												/>
										</label>

										<button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					)
				}}
			</Query>
		);
	}
}

export {UPDATE_ITEM_MUTATION, SINGLE_ITEM_QUERY};
export default UpdateItem;