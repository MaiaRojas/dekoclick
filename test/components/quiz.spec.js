import React from 'react';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import Quiz from '../../src/components/quiz';


describe('<Quiz />', () => {

  // it.only('should print warning in console.error when missing part', () => {
    // const stub = sinon.stub(console, 'error');
    // const component = render(<Quiz />);
    // console.log(component);
		// expect(stub.calledOnce).toBe(true);
    // expect(stub.getCall(0).args[0]).toMatchSnapshot();
    // console.error.restore();
	// });

  // cuando props.progress es un objeto vacío no hay progreso
  // cuando props.progress es un array es que ya tenemos respuestas
  // cuando props.progress es un objeto con propiedad `results` es que ya se envío

  it('should show notice before starting quiz');

  it('should start quiz...');

  it('should save progress as we go');

  it('should submit quiz...');

  it.only('should...', () => {
    const component = render(
      <Quiz
        part={{
          questions: [
            {
              title: 'Foo',
              description: 'Blah blah blaf',
              answers: [
                'an answer',
                'another possible answer'
              ],
              solution: [1],
            }
          ]
        }}
        progress={{}}
        firebase={{ database: () => {} }}
      />
    );
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
