/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { StickyContainer, Sticky } from 'react-sticky';
import s from './Layout.scss';
import Header from '../Header';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <StickyContainer>
        <Sticky className="navbar-fixed-top">
          <Header />
        </Sticky>
        {this.props.children}
      </StickyContainer>
    );
  }
}

export default withStyles(s)(Layout);
