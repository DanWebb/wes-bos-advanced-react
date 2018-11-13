import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {formatDistance} from 'date-fns';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';

const ORDERS_QUERY = gql`
	query ORDERS_QUERY {
		orders {
			id
			total 
			createdAt
			user {
				id
			}
			items {
				id
				title
				price
				description
				quantity
				image
			}
		}
	}
`;

const OrderUl = styled.ul`
	display: grid;
	grid-gap: 4rem;
	grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class Orders extends Component {
	render() {
		return (
			<Query query={ORDERS_QUERY}>
				{({data: {orders}, error, loading}) => {
					if (error) return <Error error={error}/>
					if (loading) return <p>Loading...</p>
					console.log(orders);
					return (
						<div>
							<h2>You have {orders.length} orders</h2>
							<OrderUl>
								{orders.map(order => (
									<OrderItemStyles key={order.id}>
										<Link href={{pathname: '/order', query: {id: order.id}}}>
											<a>
												<div className="order-meta">
													<p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
													<p>{order.items.length} products</p>
													<p>{formatDistance(order.createdAt, new Date())}</p>
													<p>{formatMoney(order.total)}</p>
												</div>
												<div className="images">
													{order.items.map(item => (
														<img key={item.id} src={item.image} alt={item.title}/>
													))}
												</div>
											</a>
										</Link>
									</OrderItemStyles>
								))}
							</OrderUl>
						</div>
					)
				}}
			</Query>
		);
	}
};

export {ORDERS_QUERY};
export default Orders;
