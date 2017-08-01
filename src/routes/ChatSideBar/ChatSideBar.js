import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendOnlineList from '../../components/FriendOnlineList';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import getFriendsQuery from './getFriendsQuery.graphql';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as chatActions from '../../actions/chat';

import s from './ChatSideBar.scss';

class ChatSideBar extends Component {
  componentWillMount() {
    const { getConversations } = this.props;
    getConversations();
  }

  render() {
    const { friends, chat } = this.props;
    return (
      <div className={s.chatSideBar}>
        <FriendOnlineList
          friends={friends}
          online={chat.online}
          directMessages={chat.directMessages}
        />
      </div>
    );
  }

}

ChatSideBar.propTypes = {
  friends: PropTypes.array.isRequired,
  getConversations: PropTypes.func,
  chat: PropTypes.object,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
    chat: state.chat,
  }),
    { ...chatActions },
  ),
  graphql(getFriendsQuery, {
    props: ({ data }) => {
      const { me } = data;
      const friends = me && me.friends || [];
      return {
        data,
        friends,
      };
    },
  }),
)(ChatSideBar);
