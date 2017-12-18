import React from 'react';
import { shallow, render } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import store from '../../src/store';
import WithMainNav from '../../src/components/with-main-nav';


describe('<WithMainNav />', () => {

  it('should print warning when missing component prop', () => {
    const stub = sinon.stub(console, 'error');
    const component = shallow(<WithMainNav />);
		expect(stub.getCalls().length > 0).toBe(true);
    expect(stub.getCall(0).args[0]).toMatchSnapshot();
    stub.restore();
	});

  it('should spread props to Component', () => {
    const Component = props => (
      <div className="my-component">
        hello {props.auth.displayName} (path is {props.match.path})
      </div>
    );
    const wrapper = render(
      <Provider store={store}>
        <WithMainNav
          component={Component}
          auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
          match={{ path: '/' }}
          history={{ push: () => {} }}
          firebase={{ logout: () => {} }}
        />
      </Provider>
    );
    const children = wrapper.children();
    expect(children.length).toEqual(2);
    expect(children[1].children[0].attribs).toMatchSnapshot();
    expect(children[1].children[0].children[0].type).toBe('text');
    expect(children[1].children[0].children[0].data).toBe('hello Ada Lovelace (path is /)');
	});

  it('should wrap component in container along with MainNav', () => {
    const Component = props => (<div className="my-component">hello world</div>);

    const wrapper = render(
      <Provider store={store}>
        <WithMainNav
          component={Component}
          auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
          match={{ path: '/' }}
          history={{ push: () => {} }}
          firebase={{ logout: () => {} }}
        />
      </Provider>
    );

    expect(wrapper.length).toBe(1);
    expect(wrapper[0].type).toBe('tag');
    expect(wrapper[0].name).toBe('div');
    expect(wrapper[0].attribs.class).toMatch(/^app /);
    expect(wrapper[0].children.length).toBe(2);

    const $muiHiddenCss = wrapper[0].children[0].children[0];
    expect($muiHiddenCss.attribs.class).toMatch(/MuiHiddenCss-mdDown-\d+/);

    const $drawer = $muiHiddenCss.children[0];
    expect($drawer.attribs.class).toMatch(/MuiDrawer-docked-\d+/);
    expect($drawer.attribs.class).toMatch(/LeftDrawer-drawer-\d+/);

    expect(wrapper.find('.my-component').length).toBe(1);
  });

});
