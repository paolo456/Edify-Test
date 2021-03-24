import {cleanup} from '@testing-library/react'
import Container from './app'
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import {callRefreshURL} from './App'


Enzyme.configure({ adapter: new Adapter() });

afterEach(cleanup)

it('Open container and check sidebar', () => {
	const wrapper = Enzyme.mount(<Container />);
	const list1 = wrapper.find('.list-detail-toggle').text()
	const list2 = wrapper.find('.default-activity-number').text()
	const list3 = wrapper.find('.all-activities').text()
	const list4 = wrapper.find('.delay-button').text()
	expect(list1).toEqual('List View')
	expect(list2).toEqual('20 Activities')
	expect(list3).toEqual('All Activities')
	expect(list4).toEqual('Send Delay')
});

it('fetch call in app', () => {
	const app = Enzyme.shallow(<Container />)
	app.instance().testApiCall().then(() => {
		expect(axios.post).toHaveBeenCalled()
		expect(axios.post).toHaveBeenCalledWith(callRefreshURL)
		done()
	})
});