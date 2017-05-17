import React from 'react';
import { shallow } from 'enzyme';
import { PostActions } from '../PostActions';

const children = (<h1>Test</h1>);
const renderComponent = (props = {}) => shallow(
  <PostActions {...props}>
    {children}
  </PostActions>,
);

describe('<PostActions />', () => {
  it('should have children', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.contains(children)).toEqual(true);
  });
});
