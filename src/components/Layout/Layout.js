import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { StickyContainer, Sticky } from 'react-sticky';
import BottomButtonGroup from '../BottomButtonGroup';
import Header from '../Header';
import Alert from '../Alert';
import s from './Layout.scss';

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <StickyContainer>
        <Sticky className="navbar-static-top">
          <Header />
        </Sticky>

        <BottomButtonGroup />

        {this.props.children}
        <Alert />
      </StickyContainer>
    );
  }
}

export default withStyles(s)(Layout);
