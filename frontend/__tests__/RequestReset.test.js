import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import RequestReset, {REQUEST_RESET_MUTATION} from '../components/RequestReset';

const mocks = [{
	request: {query: REQUEST_RESET_MUTATION, variables: {email: 'mail@danwebb.co'}},
	result: {data: {requestReset: {message: 'success', __typename: 'Message'}}}
}];

describe('<RequestReset/>', () => {
	it('renders', async () => {
		const wrapper = mount(
			<MockedProvider>
				<RequestReset/>
			</MockedProvider>
		);
		const form = wrapper.find('form[data-test="form"]');
		expect(toJSON(form)).toMatchSnapshot();
	});

	it('mutation', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<RequestReset/>
			</MockedProvider>
		);
		const form = wrapper.find('form[data-test="form"]');
		wrapper.find('input').simulate('change', {target: {name: 'email', value: 'mail@danwebb.co'}});
		wrapper.find('form[data-test="form"]').simulate('submit');
		await wait(10);
		wrapper.update();
		expect(wrapper.find('form[data-test="form"] p').text()).toContain('Check your email for a reset link!');
	});
});