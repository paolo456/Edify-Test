import Container, {callRefreshURL} from './App.js'
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({ adapter: new Adapter() });

it('Open container and check sidebar and calendar', () => {
	const wrapper = Enzyme.mount(<Container></Container>);
	
	const container = wrapper.find('.container')
	expect(container).toBeTruthy()

	const listToggle = wrapper.find('.list-detail-toggle').text()
	expect(listToggle).toEqual('List View')

	const defaultActivity = wrapper.find('.default-activity-number').text()
	expect(defaultActivity).toEqual('20 Activities')

	const allActivites = wrapper.find('.all-activities').text()
	expect(allActivites).toEqual('All Activities')

	const delayButton = wrapper.find('.delay-button').text()
	expect(delayButton).toEqual('Send Delay')

	const calendar = wrapper.find('.calendar').text()
	expect(calendar).toBeTruthy()
});
