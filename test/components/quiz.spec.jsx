import React from 'react';
import { render } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../src/store';
import Quiz from '../../src/components/quiz';


describe('<Quiz />', () => {

  it.skip('should print warning when missing part, progress, firebase, auth or match', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    expect(() => render(<Provider store={store}><Quiz /></Provider>))
      .toThrow(/startedAt/);

    expect(spy.mock.calls.length).toBe(5);
    expect(spy.mock.calls).toMatchSnapshot();

    spy.mockReset();
    spy.mockRestore();
  });

  // cuando props.progress es un objeto vacío no hay progreso
  // cuando props.progress es un array es que ya tenemos respuestas
  // cuando props.progress es un objeto con propiedad `results` es que ya se envío

  it.skip('should show notice before starting quiz', () => {});

  it.skip('should start quiz...', () => {});

  it.skip('should save progress as we go', () => {});

  it.skip('should submit quiz...', () => {});

  it.skip('should...', () => {
    const component = render((
      <Provider store={store}>
        <Quiz
          part={{
            durationString: '10min',
            questions: [
              {
                title: 'Foo',
                description: 'Blah blah blaf',
                answers: [
                  'an answer',
                  'another possible answer',
                ],
                solution: [1],
              },
            ],
          }}
          progress={{}}
          firebase={{ database: () => {} }}
          auth={{}}
          match={{
            params: {
              cohortid: 'foo',
              courseid: 'test',
              unitid: '01-bar',
              partid: '05-quiz',
            },
          }}
        />
      </Provider>
    ));
    console.log(component.html());
  });

  // it('should render to a <header> containing an <h2> with the title', () => {
  //   const component = render(<TopBar title="Blah blah blah" />);
  //   const $header = component.children().first();
  //   expect($header.get(0).tagName).toBe('header');
  //   expect($header.hasClass('mui-fixed')).toBe(true);
  //   expect(component.find('h2').text()).toBe('Blah blah blah');
  // });
  //
  // it('should have classes prop injected and title prop on instance', () => {
  //   const component = shallow(<TopBar title="foo" />);
  //   expect(component).toHaveLength(1);
  //   expect(component.props()).toMatchSnapshot()
  //   expect(component.instance().props).toEqual({ title: 'foo' });
  // });

});
