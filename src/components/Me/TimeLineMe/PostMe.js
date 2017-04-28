import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from '../TimeLine/TimeLine.scss';
import Post from '../../Post';

class PostMe extends React.Component {


  render() {
    return (
      <div >

        <Post
          {...this.props}
        />

      </div>
    );
  }
}

export default withStyles(s)(PostMe);
