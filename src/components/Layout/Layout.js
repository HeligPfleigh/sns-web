import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { configureAnchors } from 'react-scrollable-anchor';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { StickyContainer, Sticky } from 'react-sticky';
import BottomButtonGroup from '../BottomButtonGroup';
import Header from '../Header';
import Alert from '../Alert';
import s from './Layout.scss';

configureAnchors({ offset: -160, scrollDuration: 200 });
class Layout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <StickyContainer>
        <Sticky className="navbar navbar-default navbar-static-top">
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
