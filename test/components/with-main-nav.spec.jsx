import React from 'react';
import { shallow, render } from 'enzyme';
import { Provider } from 'react-redux';
import Intl from '../../src/intl';
import store from '../../src/store';
import WithMainNav from '../../src/components/with-main-nav';


describe('<WithMainNav />', () => {

  it('should print warning when missing component prop', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    shallow(<WithMainNav />);

    expect(spy.mock.calls.length > 0).toBe(true);
    expect(spy.mock.calls[0]).toMatchSnapshot();

    spy.mockReset();
    spy.mockRestore();
  });

  it.skip('should spread props to Component', () => {
    const Component = props => (
      <div className="my-component">
        hello {props.auth.displayName} (path is {props.match.path})
      </div>
    );
    const wrapper = render((
      <Provider store={store}>
        <Intl profile={{ locale: 'es-ES' }}>
          <WithMainNav
            component={Component}
            auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
            match={{ path: '/' }}
            history={{ push: () => {} }}
            firebase={{ logout: () => {} }}
          />
        </Intl>
      </Provider>
    ));

    console.log(wrapper);
    // const children = wrapper.children();
    // expect(children.length).toEqual(1);
    // console.log(children.children()[0]);
    // expect(children[1].children[0].attribs).toMatchSnapshot();
    // expect(children[1].children[0].children[0].type).toBe('text');
    // expect(children[1].children[0].children[0].data).toBe('hello Ada Lovelace (path is /)');
  });

  it.skip('should wrap component in container along with MainNav', () => {
    const Component = () => (<div className="my-component">hello world</div>);

    const wrapper = render((
      <Provider store={store}>
        <WithMainNav
          component={Component}
          auth={{ displayName: 'Ada Lovelace', email: 'ada@gmail.com' }}
          match={{ path: '/' }}
          history={{ push: () => {} }}
          firebase={{ logout: () => {} }}
        />
      </Provider>
    ));

    expect(wrapper.length).toBe(1);
    expect(wrapper[0].type).toBe('tag');
    expect(wrapper[0].name).toBe('div');
    expect(wrapper[0].attribs.class).toMatch(/^app /);
    expect(wrapper[0].children.length).toBe(2);

    const $muiHiddenCss = wrapper[0].children[0].children[0];
    expect($muiHiddenCss.attribs.class).toMatch(/MuiHiddenCss-smDown-\d+/);

    const $drawer = $muiHiddenCss.children[0];
    expect($drawer.attribs.class).toMatch(/MuiDrawer-docked-\d+/);
    expect($drawer.attribs.class).toMatch(/LeftDrawer-drawer-\d+/);

    expect(wrapper.find('.my-component').length).toBe(1);
  });

});
