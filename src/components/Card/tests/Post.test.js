// https://github.com/kriasoft/isomorphic-style-loader/issues/60#issuecomment-287651506
// https://github.com/kriasoft/isomorphic-style-loader/pull/84
// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
import React from 'react';
import { shallow } from 'enzyme';
import { Post } from '../Post';

const children = (<h1>Test</h1>);
const renderComponent = (props = {}) => shallow(
  <Post {...props}>
    {children}
  </Post>,
);

describe('<Post />', () => {
  it('should render an <div> tag', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.type()).toEqual('div');
  });

  it('should have children', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.contains(children)).toEqual(true);
  });
});
