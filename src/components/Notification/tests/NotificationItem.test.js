
import { getNotifyContent } from '../NotificationItem';
import { LIKES, COMMENTS, NEW_POST, ACCEPTED_FRIEND, FRIEND_REQUEST } from '../../../constants';

describe('<NotificationItem />', () => {
  it('getNotifyContent - like', () => {
    const r = getNotifyContent({
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, {
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, LIKES, [{
      profile: {
        firstName: 'Thanh',
        lastName: 'Le',
        picture: 'https://graph.facebook.com/1232151020232679/picture?type=large',
      },
      username: 'Le_Thanh',
      _id: '5959f7c44fdd127262e18f16',
    }]);
    expect(r).toEqual(' vừa thích bài viết của bạn.');
  });

  it('getNotifyContent - comment', () => {
    const r = getNotifyContent({
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, {
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, COMMENTS, [{
      profile: {
        firstName: 'Thanh',
        lastName: 'Le',
        picture: 'https://graph.facebook.com/1232151020232679/picture?type=large',
      },
      username: 'Le_Thanh',
      _id: '5959f7c44fdd127262e18f16',
    }]);
    expect(r).toEqual(' vừa bình luận bài viết của bạn.');
  });

  it('getNotifyContent - new post', () => {
    const r = getNotifyContent({
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, {
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, NEW_POST, [{
      profile: {
        firstName: 'Thanh',
        lastName: 'Le',
        picture: 'https://graph.facebook.com/1232151020232679/picture?type=large',
      },
      username: 'Le_Thanh',
      _id: '5959f7c44fdd127262e18f16',
    }]);
    expect(r).toEqual(' vừa viết lên tường nhà bạn.');
  });

  it('getNotifyContent - accepted friend', () => {
    const r = getNotifyContent({
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, {
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, ACCEPTED_FRIEND, [{
      profile: {
        firstName: 'Thanh',
        lastName: 'Le',
        picture: 'https://graph.facebook.com/1232151020232679/picture?type=large',
      },
      username: 'Le_Thanh',
      _id: '5959f7c44fdd127262e18f16',
    }]);
    expect(r).toEqual(' đã chấp nhận lời mời kết bạn của bạn');
  });

  it('getNotifyContent - friend request', () => {
    const r = getNotifyContent({
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, {
      profile: {
        firstName: 'Nam',
        lastName: 'Hoang',
        picture: 'https://graph.facebook.com/596825810516199/picture?type=large',
      },
      username: 'particle4dev',
      _id: '58f9c1bf2d4581000484b188',
    }, FRIEND_REQUEST, [{
      profile: {
        firstName: 'Thanh',
        lastName: 'Le',
        picture: 'https://graph.facebook.com/1232151020232679/picture?type=large',
      },
      username: 'Le_Thanh',
      _id: '5959f7c44fdd127262e18f16',
    }]);
    expect(r).toEqual(' đã gửi cho bạn 1 lời mời kết bạn');
  });
});
