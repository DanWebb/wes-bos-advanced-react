import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import Nav from '../components/Nav';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser, fakeCartItem} from '../lib/testUtils';

const notSignedInMocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: null}}
}];

const signedInMocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: fakeUser()}}
}];

const signedInMocksWithCart = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: {...fakeUser(), cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]}}}
}];

describe('<Nav/>', () => {
	it('renders signed out', async () => {
		const wrapper = mount(
			<MockedProvider mocks={notSignedInMocks}>
				<Nav/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		const nav = wrapper.find('ul[data-test="nav"]');
		expect(nav.children().length).toBe(2);
		expect(nav.text()).toContain('signup');
	});

	it('renders sign in', async () => {
		const wrapper = mount(
			<MockedProvider mocks={signedInMocks}>
				<Nav/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		const nav = wrapper.find('ul[data-test="nav"]');
		expect(nav.children().length).toBe(6);
		expect(nav.text()).toContain('signout');
	});

	it('renders cart item count', async () => {
		const wrapper = mount(
			<MockedProvider mocks={signedInMocksWithCart}>
				<Nav/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		const nav = wrapper.find('ul[data-test="nav"]');
		const count = nav.find('div.count');
		expect(toJSON(count)).toMatchSnapshot();
	});
});