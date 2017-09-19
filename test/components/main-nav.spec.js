import React from 'react';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import MainNav from '../../src/components/main-nav';


describe('<MainNav />', () => {

  it('should print warnings when missing history and firebase props', () => {
    const stub = sinon.stub(console, 'error');
    const component = render(<MainNav />);
		expect(stub.getCalls().length).toBe(2);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    expect(stub.getCall(1).args[0]).toMatchSnapshot();
    stub.restore();
	});

  it('should print warnings when missing history.push and firebase.logout props', () => {
    const stub = sinon.stub(console, 'error');
    const component = render(<MainNav history={{}} firebase={{}} />);
		expect(stub.getCalls().length).toBe(2);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    expect(stub.getCall(1).args[0]).toMatchSnapshot();
    stub.restore();
  });

  it('should render a <LeftDrawer> with a <List>', () => {
    const component = shallow(
      <MainNav
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    ).dive();

    expect(component.node.type.Naked.name).toBe('LeftDrawer');
    expect(component.node.type.displayName).toBe('withStyles(LeftDrawer)');
    expect(component.node.props.children.type.Naked.name).toBe('List');
    expect(component.node.props.children.type.displayName).toBe('withStyles(List)');
  });

  it('should render a <List> with array of <ListItem>s or <Divider>s', () => {
    const component = shallow(
      <MainNav
        history={{ push: () => {} }}
        firebase={{ logout: () => {} }}
      />
    ).dive();

    expect(component.node.props.children.props.children.length).toBe(6);
    component.node.props.children.props.children.forEach(child => {
      expect(['ListItem', 'Divider'].indexOf(child.type.Naked.name) > -1).toBe(true);
      expect(['withStyles(ListItem)', 'withStyles(Divider)'].indexOf(child.type.displayName) > -1).toBe(true);
    });
  });

});
