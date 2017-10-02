import React from 'react';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import MainNav from '../../src/components/main-nav';


describe('<MainNav />', () => {

  it('should throw when missing props.auth and warn for missing props', () => {
    const stub = sinon.stub(console, 'error');
    expect(() => render(<MainNav />)).toThrow();
    expect(stub.getCalls().length).toBe(4);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    expect(stub.getCall(1).args[0]).toMatchSnapshot();
    expect(stub.getCall(2).args[0]).toMatchSnapshot();
    expect(stub.getCall(3).args[0]).toMatchSnapshot();
    stub.restore();
  });

  it('should throw when missing props.match', () => {
    expect(() => render(
      <MainNav auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }} />
    )).toThrow();
  });

  it('should print warnings when missing history.push and firebase.logout props', () => {
    const stub = sinon.stub(console, 'error');
    const component = render(
      <MainNav
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
        history={{}}
        firebase={{}} />
    );
		expect(stub.getCalls().length).toBe(2);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    expect(stub.getCall(1).args[0]).toMatchSnapshot();
    stub.restore();
  });

  it('should render a <LeftDrawer> with a <List>', () => {
    const component = shallow(
      <MainNav
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    ).dive();

    const el = component.getElement();
    expect(el.type.Naked.name).toBe('LeftDrawer');
    expect(el.type.displayName).toBe('withStyles(LeftDrawer)');
    expect(el.props.children.type.Naked.name).toBe('List');
    expect(el.props.children.type.displayName).toBe('withStyles(List)');
  });

  it('should render a <List> with array of <ListItem>s or <Divider>s', () => {
    const component = shallow(
      <MainNav
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    ).dive();

    const el = component.getElement();
    expect(el.props.children.props.children.length).toBe(7);
    const lastChild = el.props.children.props.children[el.props.children.props.children.length - 1];
    expect(lastChild.type).toBe('div');
    el.props.children.props.children.slice(0, -1).forEach(child => {
      expect(['ListItem', 'Divider'].indexOf(child.type.Naked.name) > -1).toBe(true);
      expect(['withStyles(ListItem)', 'withStyles(Divider)'].indexOf(child.type.displayName) > -1).toBe(true);
    });
  });

});
