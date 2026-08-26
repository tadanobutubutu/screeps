import React from 'react';
import { shallow } from 'enzyme';
import DependencyGraph from './dependency-graph';

describe('DependencyGraph', () => {
  it('should have scope attribute for table headers', () => {
    const wrapper = shallow(<DependencyGraph />);
    expect(wrapper.find('th').prop('scope')).toEqual('col');
  });
});