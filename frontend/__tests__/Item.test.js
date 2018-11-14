import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';
import ItemComponent from '../components/Item';
import formatMoney from '../lib/formatMoney';

const fakeItem = {
	id: 'ABC123',
	title: 'Emu',
	price: 5000,
	description: 'uuuuzzz',
	image: 'emu.jpg',
	largeImage: 'largeEmu.jpg'
};

describe('<Item/>', () => {
	it('renders and matches the snapshot', () => {
		const wrapper = shallow(<ItemComponent item={fakeItem}/>);
		expect(toJSON(wrapper)).toMatchSnapshot();
	});

	// it('renders the details', () => {
	// 	const wrapper = shallow(<ItemComponent item={fakeItem}/>);
	// 	const PriceTag = wrapper.find('PriceTag');
	// 	expect(PriceTag.children().text()).toBe(formatMoney(fakeItem.price));
	// 	expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
	// });

	// it('renders the image', () => {
	// 	const wrapper = shallow(<ItemComponent item={fakeItem}/>);
	// 	const img = wrapper.find('img')
	// 	expect(img.props().src).toBe(fakeItem.image);
	// 	expect(img.props().alt).toBe(fakeItem.title);
	// });

	// it('renders the buttons', () => {
	// 	const wrapper = shallow(<ItemComponent item={fakeItem}/>);
	// 	const buttonList = wrapper.find('.buttonList');
	// 	expect(buttonList.children()).toHaveLength(3);
	// 	expect(buttonList.find('Link')).toHaveLength(1);
	// 	expect(buttonList.find('AddToCart')).toHaveLength(1);
	// 	expect(buttonList.find('DeleteItem')).toHaveLength(1);
	// });
})