import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import {Mutation} from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import calcTotalQuantity from '../lib/calcTotalQuantity';
import Error from './ErrorMessage';
import User, {CURRENT_USER_QUERY} from './User';

const CREATE_ORDER_MUTATION = gql`
	mutation CREATE_ORDER_MUTATION($token: String!) {
		createOrder(token: $token) {
			id
			charge
			total
			items {
				id
				title
			}
		}
	}
`;

class TakeMyMoney extends Component {
	onToken = ({id}, createOrder) => {
		createOrder(
			{variables: {token: id}}
		).catch(err => alert(err.message));
	}

	render() {
		return (
			<User>
				{({data: {me}}) => (
					<Mutation
						mutation={CREATE_ORDER_MUTATION}
						refetchQueries={[{query: CURRENT_USER_QUERY}]}
					>
						{createOrder => (
							<StripeCheckout
								amount={calcTotalPrice(me.cart)}
								name="Emuz"
								description={`Order of ${calcTotalQuantity(me.cart)} items!`}
								image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
								stripeKey="pk_test_mxhhC5KAYCaxxwPA0383YN5J"
								currency="USD"
								email={me.email}
								token={res => this.onToken(res, createOrder)}
							>
								{this.props.children}
							</StripeCheckout>
						)}
					</Mutation>
				)}
			</User>
		);
	}
}

export {CREATE_ORDER_MUTATION};
export default TakeMyMoney;
