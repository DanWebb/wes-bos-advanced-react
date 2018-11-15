import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {ApolloConsumer} from 'react-apollo';
import RemoveFromCart, {REMOVE_FROM_CART_MUTATION} from '../components/RemoveFromCart';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

global.alert = console.log;

const me = fakeUser();
const mocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: {...me, cart: [fakeCartItem({id: 'abc123'})]}}} 
}, {
	request: {query: REMOVE_FROM_CART_MUTATION, variables: {id: 'abc123'}},
	result: {data: {removeFromCart: {__typename: 'CartItem', id: 'abc123'}}}
}];

describe('<RemoveFromCart/>', () => {
	it('renders', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<RemoveFromCart id="abc123"/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
	});

	it('Removes', async () => {
		let apolloClient = apolloClient;
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<ApolloConsumer>
					{client => {
						apolloClient = client;
						return <RemoveFromCart id="abc123"/>;
					}}
				</ApolloConsumer>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		const res = await apolloClient.query({query: CURRENT_USER_QUERY});
		expect(res.data.me.cart).toHaveLength(1);
		wrapper.find('button').simulate('click');
		await wait();
		const resTwo = await apolloClient.query({query: CURRENT_USER_QUERY});
		expect(resTwo.data.me.cart).toHaveLength(0);
	});
});