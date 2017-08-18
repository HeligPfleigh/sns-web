/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col } from 'react-bootstrap';
import classnames from 'classnames';
import ConversationList from '../../components/Chat/ConversationList';
import ConversationView from '../../components/Chat/ConversationView';
import s from './Messages.scss';

class Messages extends Component {
  constructor() {
    super();
    this.state = {
      activeViewMobile: false,
    };
  }
  handleToggleChatView = () => {
    this.setState({
      activeViewMobile: !this.state.activeViewMobile,
    });
  }
  render() {
    const { activeViewMobile } = this.state;
    const { conversationId } = this.props;
    return (
      <Grid className={s.root}>
        <Row className={s.fullHeight}>
          <Col md={3} xs={12} className={classnames(s.fullHeight, { hiddenMobile: activeViewMobile })}>
            <Row className={s.fullHeight}>
              <ConversationList
                conversationId={conversationId}
                handleToggleChatView={this.handleToggleChatView}
              />
            </Row>
          </Col>
          <Col md={9} xs={12} className={classnames(s.fullHeight, { hiddenMobile: !activeViewMobile })}>
            <Row className={s.fullHeight}>
              <ConversationView
                handleToggleChatView={this.handleToggleChatView}
              />
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Messages.propTypes = {
  conversationId: PropTypes.string,
};

export default withStyles(s)(Messages);
