import React from 'react';
import HelloWorld from './HelloWorld';

import { mount } from 'enzyme';

let wrapper = null;

beforeEach(() => {
    wrapper = mount(<HelloWorld />);
});

afterEach(() => {
    wrapper.unmount();
})

it('renders Hello World!', () => {
    expect(wrapper.contains(<h1>Hello World!</h1>)).toEqual(true);
});

it('renders the Paragraph Component', () => {
    expect(wrapper.contains(<p>This is a paragraph</p>)).toEqual(true);
})


