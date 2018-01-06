import React from 'react';
import { shallow, mount } from 'enzyme';
import CohortUser from '../../src/components/cohort-user';


describe('<CohortUser />', () => {

  it('should warn when missing required props', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    shallow(<CohortUser />);
    expect(spy.mock.calls).toMatchSnapshot();
    spy.mockReset();
    spy.mockRestore();
  });

  it.skip('should ...', () => {
    /* eslint-disable jsx-a11y/aria-role */
    const component = mount((
      <CohortUser
        uid="xxx"
        cohortid="lim-2050-01-bc-core-am"
        role="student"
        profile={{
          name: 'Ada Lovelace',
          email: 'ada@lovelace.com',
          github: 'lupomontero',
        }}
        toggleMoveDialog={jest.fn()}
        firebase={{ database: jest.fn() }}
      />
    ));
    /* eslint-enable jsx-a11y/aria-role */

    console.log(component.find('a').map(el => console.log(el) || el.text()));
    // console.log(component.html());
    // expect(component.html()).toMatchSnapshot();
  });

});
