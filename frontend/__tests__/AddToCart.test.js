import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {ApolloConsumer} from 'react-apollo';
import AddToCart, {ADD_TO_CART_MUTATION} from '../components/AddToCart';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

const me = fakeUser();
const mocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: {...me, cart: []}}} 
}, {
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: {...me, cart: [fakeCartItem()]}}} 
}, {
	request: {query: ADD_TO_CART_MUTATION, variables: {id: 'abc123'}},
	result: {data: {addToCart: {...fakeCartItem(), quantity: 1}}}
}];

describe('<AddToCart/>', () => {
	it('renders', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<AddToCart id="abc123"/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
	});

	it('add to cart', async () => {
		let apolloClient = apolloClient;
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<ApolloConsumer>
					{client => {
						apolloClient = client;
						return <AddToCart id="abc123"/>;
					}}
				</ApolloConsumer>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		const {data: {me}} = await apolloClient.query({query: CURRENT_USER_QUERY});
		expect(me.cart).toHaveLength(0);
		wrapper.find('button').simulate('click')
		await wait();
		const {data: {me: meTwo}} = await apolloClient.query({query: CURRENT_USER_QUERY});
		expect(meTwo.cart).toHaveLength(1);
	});

	it('loading', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<AddToCart id="abc123"/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		expect(wrapper.text()).toContain('Add To Cart');
		wrapper.find('button').simulate('click');
		expect(wrapper.text()).toContain('Adding To Cart');
	})
});