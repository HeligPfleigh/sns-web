import React from 'react';
import { shallow } from 'enzyme';
import { Feed } from '../Feed';
import Post, { PostHeader, PostText, PostActions, PostContent } from '../../Card';
import Divider from '../../Divider';

const renderComponent = (props = {}) => shallow(
  <Feed
    key={props.item._id}
    data={props.item}
    userInfo={props.userInfo}
    loadMoreComments={props.loadMoreComments}
    createNewComment={props.createNewComment}
  />,
);

function doNothing(evt) {
  evt.preventDefault();
}

describe('<Feed />', () => {
  it('should have children', () => {
    const renderedComponent = renderComponent({
      item: {
        author: {
          _id: '58f9c1bf2d4581000484b188',
          username: 'particle4dev',
          profile: {
            firstName: 'Nam',
            lastName: 'Hoang',
            picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
          },
        },
        comments: [],
        createdAt: '2017-05-15T08:46:07.987Z',
        isLiked: null,
        message: 'message',
        totalComments: 0,
        totalLikes: 1,
        user: {
          _id: '58f9c1bf2d4581000484b188',
          username: 'particle4dev',
          profile: {
            firstName: 'Nam',
            lastName: 'Hoang',
            picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
          },
        },
        _id: '59196acf13f21febf8a10503',
      },
      userInfo: {
        _id: '58f9c1bf2d4581000484b188',
        username: 'particle4dev',
        profile: {
          firstName: 'Nam',
          lastName: 'Hoang',
          picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
        },
      },
      loadMoreComments: doNothing,
      createNewComment: doNothing,
    });
    expect(renderedComponent.find(PostHeader).length).toEqual(1);
    expect(renderedComponent.find(Divider).length).toEqual(1);
    expect(renderedComponent.find(PostContent).length).toEqual(1);
    expect(renderedComponent.find(PostActions).length).toEqual(1);
    expect(renderedComponent.find(PostText).length).toEqual(2);
    expect(renderedComponent.find(Post).length).toEqual(1);
  });
});
