import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {ApolloConsumer} from 'react-apollo';
import NProgress from 'nprogress';
import Router from 'next/router';
import TakeMyMoney, {CREATE_ORDER_MUTATION} from '../components/TakeMyMoney';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

Router.router = {push: () => {}};

const me = fakeUser();
const mocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: {...me, cart: [fakeCartItem()]}}} 
}]
//  {
// 	request: {query: CREATE_ORDER_MUTATION, variables: {id: 'abc123'}},
// 	result: {data: {removeFromCart: {__typename: 'CartItem', id: 'abc123'}}}
// }];

describe('<TakeMyMoney/>', () => {
	it('renders', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		expect(toJSON(wrapper.find('ReactStripeCheckout'))).toMatchSnapshot();
	});

	it('calls onToken with token', async () => {
		const createOrderMock = jest.fn().mockResolvedValue({
			data: {createOrder: {id: 'xyz789'}}
		});
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney/>
			</MockedProvider>
		);
		const component = wrapper.find('TakeMyMoney').instance();
		component.onToken({id: 'abc123'}, createOrderMock);
		expect(createOrderMock).toHaveBeenCalledWith({variables: {token: 'abc123'}});
	});


	it('starts loading', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		NProgress.start = jest.fn();
		const createOrderMock = jest.fn().mockResolvedValue({
			data: {createOrder: {id: 'xyz789'}}
		});
		const component = wrapper.find('TakeMyMoney').instance();
		component.onToken({id: 'abc123'}, createOrderMock);
		expect(NProgress.start).toHaveBeenCalled();
	});

	it('redirects to order', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<TakeMyMoney/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		const createOrderMock = jest.fn().mockResolvedValue({
			data: {createOrder: {id: 'xyz789'}}
		});
		const component = wrapper.find('TakeMyMoney').instance();
		Router.router.push = jest.fn();
		component.onToken({id: 'abc123'}, createOrderMock);
		await wait();
		expect(Router.router.push).toHaveBeenCalledWith({
			pathname: '/order',
			query: {id: 'xyz789'}
		});
	});
});