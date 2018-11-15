import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import formatMoney from '../lib/formatMoney';
import Form from './styles/Form';
import Error from '../components/ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String! 
		$description: String! 
		$price: Int! 
		$image: String 
		$largeImage: String
	) {
		createItem(
			title: $title 
			description: $description 
			price: $price 
			image: $image 
			largeImage: $largeImage
		) {
			id
		}
	}
`;

class CreateItem extends Component {
	state = {
		title: '',
		description: '',
		image: '',
		largeImage: '',
		price: 0
	}

	handleChange = e => {
		const {name, type, value} = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({[name]: val});
	}

	handleSubmit = async (e, createItem) => {
		e.preventDefault();
		const response = await createItem();
		Router.push({
			pathname: '/item',
			query: {id: response.data.createItem.id}
		});
	}

	handleUploadFile = async e => {
		const files = e.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'sickfits');
		
		const response = await fetch('https://api.cloudinary.com/v1_1/danwebb/image/upload', {
			method: 'POST',
			body: data
		});
		const file = await response.json();

		this.setState({
			image: file.secure_url || '',
			largeImage: file.eager[0].secure_url
		});
	}

	render() { 
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
				{(createItem, {loading, error}) => (
					<Form data-test="form" onSubmit={e => this.handleSubmit(e, createItem)}>
						<Error error={error}/>
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor="file">
								Image
								<input
									required
									type="file"
									id="file"
									name="file"
									placeholder="Upload an image"
									onChange={this.handleUploadFile}
								/>
								{this.state.image && <img src={this.state.image} width="200" alt="Upload Preview"/>}
							</label>

							<label htmlFor="title">
								Title
								<input
									required
									type="text"
									id="title"
									name="title"
									placeholder="Title"
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
									value={this.state.description}
									onChange={this.handleChange}
								/>
							</label>

							<button type="submit">Create</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export {CREATE_ITEM_MUTATION};
export default CreateItem;