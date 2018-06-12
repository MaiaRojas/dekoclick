import React from 'react';
import { shallow } from 'enzyme';
import MainNav from '../../src/components/main-nav';


describe.skip('<MainNav />', () => {

  it('should warn when missing props: auth, match, history, firebase', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());

    shallow(<MainNav />);

    expect(spy.mock.calls.length).toBe(4);
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[0]).toMatchSnapshot();

    spy.mockReset();
    spy.mockRestore();
  });

  it('should warn when missing nested props: history.push, firebase.logout', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => null);
    shallow((
      <MainNav
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
        history={{}}
        firebase={{}}
      />
    ));

    expect(spy.mock.calls.length).toBe(2);
    expect(spy.mock.calls[0]).toMatchSnapshot();
    expect(spy.mock.calls[1]).toMatchSnapshot();

    spy.mockReset();
    spy.mockRestore();
  });

  it('should render a <LeftDrawer> with a <List>', () => {
    const component = shallow((
      <MainNav
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    )).dive();

    const el = component.getElement();
    expect(el.type.Naked.name).toBe('LeftDrawer');
    expect(el.type.displayName).toBe('Connect(WithStyles(LeftDrawer))');
    expect(el.props.children.type.Naked.name).toBe('List');
    expect(el.props.children.type.displayName).toBe('WithStyles(List)');
  });

  it('should render a <List> with array of <ListItem>s or <Divider>s', () => {
    const component = shallow((
      <MainNav
        auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
        match={{ path: '/' }}
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    )).dive();

    const el = component.getElement();
    expect(el.props.children.props.children.length).toBe(8);
    const lastChild = el.props.children.props.children[el.props.children.props.children.length - 1];
    expect(lastChild.type).toBe('div');
    el.props.children.props.children.slice(0, -1).forEach((child) => {
      if (child) {
        expect(['ListItem', 'Divider'].indexOf(child.type.Naked.name) > -1).toBe(true);
        expect(['WithStyles(ListItem)', 'WithStyles(Divider)'].indexOf(child.type.displayName) > -1).toBe(true);
      }
    });
  });

});
