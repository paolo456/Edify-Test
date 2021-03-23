import React from 'react';
import { shallow } from 'enzyme';
import Container from './index.js';
describe("MyComponent", () => {
  it("should render my component", () => {
    const wrapper = shallow(<Container />);
  });
});