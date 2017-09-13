'use strict';


import React from 'react';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import TopBar from '../../src/components/top-bar';


describe('<TopBar />', () => {

  it('should print warning in console.error when missing title', () => {
    const stub = sinon.stub(console, 'error');
    const component = render(<TopBar />);
		expect(stub.calledOnce).toBe(true);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    console.error.restore();
	});

  it('should render to a <header> containing an <h2> with the title', () => {
    const component = render(<TopBar title="Blah blah blah" />);
    const $header = component.children().first();
    expect($header.get(0).tagName).toBe('header');
    expect($header.hasClass('mui-fixed')).toBe(true);
    expect(component.find('h2').text()).toBe('Blah blah blah');
  });

  it('should have classes prop injected and title prop on instance', () => {
    const component = shallow(<TopBar title="foo" />);
    expect(component).toHaveLength(1);
    expect(component.props()).toMatchSnapshot()
    expect(component.instance().props).toEqual({ title: 'foo' });
  });

});
