import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import getFriendsQuery from './getFriendsQuery.graphql';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './ChatSideBar.scss';

class ChatSideBar extends Component {
  render() {
    return (
      <div className={s.chatSideBar}>

      </div>
    );
  }
}

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  
)(ChatSideBar);
