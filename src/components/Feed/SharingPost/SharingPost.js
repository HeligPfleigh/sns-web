import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image } from 'react-bootstrap';
import Post, { PostHeader, PostText } from '../../Card';
import Icon from '../../Icon';
import TimeAgo from '../../TimeAgo';
import Link from '../../Link';
import { PUBLIC, FRIEND, ONLY_ME } from '../../../constants';
import s from './SharingPost.scss';

function doNothing(e) {
  e.preventDefault();
}

class SharingPost extends Component {
  render() {
    const { id, message, author, user, building, privacy, createdAt } = this.props;
    return (
      <div style={{ marginTop: '35px' }}>
        <Post >
          <div style={{ marginBottom: '40px' }}>
            <PostHeader
              avatar={
                <span>
                  { author &&
                    <Link title={`${author.profile.firstName} ${author.profile.lastName}`} to={`/user/${author._id}`}>
                      <Image src={author.profile.picture} circle />
                    </Link>
                  }
                </span>
              }
              title={
                <span>
                  { author && <Link to={`/user/${author._id}`}>
                    <strong>{`${author.profile.firstName} ${author.profile.lastName}`}</strong>
                    </Link>
                  }

                  { ((user && (user._id !== author._id)) || building) &&
                    <span style={{ margin: '0 6px' }}>
                      <i className="fa fa-caret-right" aria-hidden="true"></i>
                    </span>
                  }

                  { !building && user && (user._id !== author._id) && <Link to={`/user/${user._id}`}>
                    <strong>{`${user.profile.firstName} ${user.profile.lastName}`}</strong>
                  </Link>
                  }
                  { building && <Link to={`/building/${building._id}`}>
                    <strong>{building.name}</strong>
                  </Link>
                  }
                </span>
              }
              subtitle={<div>
                { PUBLIC === privacy && <Icon onClick={doNothing} icons="fa fa-globe fa-1" /> }
                { FRIEND === privacy && <Icon onClick={doNothing} icons="fa fa-users fa-1" /> }
                { ONLY_ME === privacy && <Icon onClick={doNothing} icons="fa fa-user fa-1" /> }
                <Link to={`/post/${id}`}><TimeAgo time={createdAt} /></Link>
              </div>}
            />
          </div>
          <PostText
            html={`${message || {}}`}
          />
        </Post>
      </div>
    );
  }
}
SharingPost.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string,
  author: PropTypes.object,
  user: PropTypes.object,
  building: PropTypes.object,
  privacy: PropTypes.string,
  createdAt: PropTypes.string,
};

export default withStyles(s)(SharingPost);
