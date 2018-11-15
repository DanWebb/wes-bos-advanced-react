import {mount} from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import {MockedProvider} from 'react-apollo/test-utils';
import CreateItem, {CREATE_ITEM_MUTATION} from '../components/CreateItem';
import {fakeItem} from '../lib/testUtils';

global.fetch = jest.fn().mockResolvedValue({
	json: () => ({
		secure_url: 'img.jpg',
		eager: [{secure_url: 'img.jpg'}]
	})
});

describe('<CreateItem/>', () => {
	it('renders', async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem/>
			</MockedProvider>
		);
		const form = wrapper.find('form[data-test="form"]');
		expect(toJSON(form)).toMatchSnapshot();
	});

	it('Uploads a file', async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem/>
			</MockedProvider>
		);
		const input = wrapper.find('input[type="file"]');
		input.simulate('change', {target: {files: ['img.jpg']}});
		await wait();
		const component = wrapper.find('CreateItem').instance();
		expect(component.state.image).toEqual('img.jpg');
		global.fetch.mockReset();
	});

	it('State updates', async () => {
		const wrapper = mount(
			<MockedProvider>
				<CreateItem/>
			</MockedProvider>
		);
		wrapper.find('#title').simulate('change', {target: {name: 'title', value: 'title'}});
		wrapper.find('#price').simulate('change', {target: {name: 'price', value: 5555}});
		wrapper.find('#description').simulate('change', {target: {name: 'description', value: 'description'}});
		await wait();
		const component = wrapper.find('CreateItem').instance();
		expect(component.state).toMatchObject({
			title: 'title',
			price: 5555,
			description: 'description'
		});
	});

	it('Creates item', async () => {
		const item = fakeItem();
		const mocks = [{
			request: {query: CREATE_ITEM_MUTATION, variables: {title: item.title, description: item.description, price: item.price, image: '', largeImage: ''}},
			result: {data: {createItem: {...item, id: 'abc123', __typename: 'Item'}}}
		}];
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<CreateItem/>
			</MockedProvider>
		);
		wrapper.find('#title').simulate('change', {target: {name: 'title', value: item.title}});
		wrapper.find('#price').simulate('change', {target: {name: 'price', value: item.price}});
		wrapper.find('#description').simulate('change', {target: {name: 'description', value: item.description}});
		Router.router = {push: jest.fn()};
		wrapper.find('form').simulate('submit');
		await wait(50);
		expect(Router.router.push).toHaveBeenCalledWith({"pathname": "/item", "query": {"id": "abc123"}});
	});
});