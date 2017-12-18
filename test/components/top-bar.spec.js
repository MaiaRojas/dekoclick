import React from 'react';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import TopBar from '../../src/components/top-bar';
import { Provider } from 'react-redux';
import store from '../../src/store';


describe('<TopBar />', () => {

  it('should print warning in console.error when missing title', () => {
    const stub = sinon.stub(console, 'error');
    const component = render(
      <Provider store={store}>
        <TopBar />
      </Provider>
    );
		expect(stub.getCalls().length > 0).toBe(true);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    stub.restore();
	});

  it('should render to a <header> containing an <h2> with the title', () => {
    const component = render(
      <Provider store={store}>
        <TopBar title="Blah blah blah" />
      </Provider>
    );
    expect(component.get(0).tagName).toBe('header');
    expect(component.hasClass('mui-fixed')).toBe(true);
    expect(component.find('h2').text()).toBe('Blah blah blah');
  });

  it('should have classes prop injected and title prop on instance', () => {
    const component = render(
      <Provider store={store}>
        <TopBar title="foo" />
      </Provider>
    );
    expect(component).toHaveLength(1);
    const $h2 = component[0].children[0].children[1];
    expect(component[0].attribs.class).toMatch(/TopBar/);
    expect($h2.children[0].type).toBe('text');
    expect($h2.children[0].data).toBe('foo');
  });

});
