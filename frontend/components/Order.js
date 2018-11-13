import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {format} from 'date-fns';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
	query SINGLE_ORDER_QUERY($id: ID!) {
		order(id: $id) {
			id
			charge
			total 
			createdAt
			user {
				id
			}
			items {
				id
				title
				description
				price
				image
				quantity
			}
		}
	}
`;

class Order extends Component {
	render() {
		return (
			<Query query={SINGLE_ORDER_QUERY} variables={{id: this.props.id}}>
				{({data: {order}, error, loading}) => {
					if (error) return <Error error={error}/>
					if (loading) return <p>Loading...</p>
					return (
						<OrderStyles>
							<Head>
								<title>EMUZ - Order {order.id}</title>
							</Head>
							<p>
								<span>Order ID:</span>
								<span>{order.id}</span>
							</p>
							<p>
								<span>Charge:</span>
								<span>{order.charge}</span>
							</p>
							<p>
								<span>Date:</span>
								<span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
							</p>
							<p>
								<span>Order Total:</span>
								<span>{formatMoney(order.total)}</span>
							</p>
							<p>
								<span>Item Count:</span>
								<span>{order.items.length}</span>
							</p>
							<div class="items">
								{order.items.map(item => (
									<div key={item.id} class="order-item">
										<img src={item.image} alt={item.title}/>
										<div class="item-details">
											<h2>{item.title}</h2>
											<p>Qty: {item.quantity}</p>
											<p>Each: {formatMoney(item.price)}</p>
											<p>Sub: {formatMoney(item.price * item.quantity)}</p>
											<p>{item.description}</p>
										</div>
									</div>
								))}
							</div>
						</OrderStyles>
					)
				}}
			</Query>
		);
	}
};

export {SINGLE_ORDER_QUERY};
export default Order;