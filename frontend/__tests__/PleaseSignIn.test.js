import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import PleaseSignIn from '../components/PleaseSignIn';
import {CURRENT_USER_QUERY} from '../components/User';
import {fakeUser} from '../lib/testUtils';

const notSignedInMocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: null}}
}];

const signedInMocks = [{
	request: {query: CURRENT_USER_QUERY},
	result: {data: {me: fakeUser()}}
}];

describe('<PleaseSignIn/>', () => {
	it('renders signed out', async () => {
		const wrapper = mount(
			<MockedProvider mocks={notSignedInMocks}>
				<PleaseSignIn/>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		expect(wrapper.text()).toContain('Please Sign In Before Continuing');
		expect(wrapper.find('Signin').exists()).toBe(true);
	});

	it('renders sign in', async () => {
		const Hey = () => <p>Hey!</p>;
		const wrapper = mount(
			<MockedProvider mocks={signedInMocks}>
				<PleaseSignIn><Hey/></PleaseSignIn>
			</MockedProvider>
		);
		await wait();
		wrapper.update();
		expect(wrapper.find('Hey').exists()).toBe(true);
	});
});