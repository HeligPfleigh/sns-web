// https://github.com/kriasoft/isomorphic-style-loader/issues/60#issuecomment-287651506
// https://github.com/kriasoft/isomorphic-style-loader/pull/84
// https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
/**
import React from 'react';
import renderer from 'react-test-renderer';
import gql from "graphql-tag";
import { print } from 'graphql-tag/printer';
import { shallow } from 'enzyme';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { addTypenameToDocument } from 'apollo-client/queries/queryTransform';
import Home from '../Home';

console.log(renderer, print, MockedProvider, 'renderer 1234');

const RELATED_CONTENT_QUERY = gql`
  query test ($limit: Int) {
    hello {
      message
    }
  }
`;

const taggedContent = {
  hello: {
    message: 'word',
  },
};

const query = addTypenameToDocument(RELATED_CONTENT_QUERY);

const variables = {
  limit: 1,
};

describe('<Home />', () => {
  it('should render an <div> tag', () => {
    console.log('123');
    const output = renderer.create(
      <MockedProvider mocks={[
        { request: { query, variables }, result: { data: taggedContent }}
      ]}>
        <Home {...variables} />
      </MockedProvider>
    );
    console.log(output.toJSON());
  });
});
*/
