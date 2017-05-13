import React from 'react';
import { shallow } from 'enzyme';
import { PostContent } from '../PostContent';

const children = (<h1>Test</h1>);
const renderComponent = (props = {}) => shallow(
  <PostContent {...props}>
    {children}
  </PostContent>,
);

describe('<PostContent />', () => {
  it('should have children', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.contains(children)).toEqual(true);
  });
});
