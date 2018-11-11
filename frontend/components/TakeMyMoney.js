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

class TakeMyMoney extends Component {
	onToken = res => {
		console.log(res.id);
	}

	render() {
		return (
			<User>
				{({data: {me}}) => (
					<StripeCheckout
						amount={calcTotalPrice(me.cart)}
						name="Emuz"
						description={`Order of ${calcTotalQuantity(me.cart)} items!`}
						image={me.cart[0].item && me.cart[0].item.image}
						stripeKey="pk_test_mxhhC5KAYCaxxwPA0383YN5J"
						currency="USD"
						email={me.email}
						token={this.onToken}
					>
						{this.props.children}
					</StripeCheckout>
				)}
			</User>
		);
	}
}

export default TakeMyMoney;
