import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { generate as idRandom } from 'shortid';
import { Grid, Row, Col } from 'react-bootstrap';
import searchPageQuery from './searchPageQuery.graphql';
import sendFriendRequestMutation from '../FriendSuggestions/sendFriendRequestMutation.graphql';
import cancelFriendRequestedMutation from './cancelFriendRequestedMutation.graphql';
import sendUnfriendRequestMutation from './sendUnfriendRequestMutation.graphql';
import acceptFriendOnSearchPageMutation from './acceptFriendOnSearchPageMutation.graphql';
import rejectFriendOnSearchPageMutation from './rejectFriendOnSearchPageMutation.graphql';
import SearchItem from './SearchItem';
import s from './Search.scss';

class Search extends Component {
  render() {
    const {
      data: {
        search,
      },
      query,
      sendFriendRequest,
      cancelFriendRequested,
      sendUnfriendRequest,
      acceptFriendAction,
      rejectFriendAction,
    } = this.props;
    return (
      <Grid>
        <Row className={s.top20}>
          <Col md={8} sm={12} xs={12}>
            { search &&
              <div className={s.friendsList}>
                <div className={s.friendsListTitle}>
                  Có { search.length } kết quả cho { query.keyword }
                </div>
                {
                  search.length > 0 && search.map(item => (
                    <SearchItem
                      key={idRandom()}
                      dataUser={item}
                      sendFriendRequest={sendFriendRequest}
                      cancelFriendRequested={cancelFriendRequested}
                      sendUnfriendRequest={sendUnfriendRequest}
                      acceptFriendAction={acceptFriendAction}
                      rejectFriendAction={rejectFriendAction}
                    />
                ))}
              </div>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

Search.propTypes = {
  data: PropTypes.shape({
    search: PropTypes.array,
  }),
  query: PropTypes.object,
  sendFriendRequest: PropTypes.func.isRequired,
  cancelFriendRequested: PropTypes.func.isRequired,
  sendUnfriendRequest: PropTypes.func.isRequired,
  acceptFriendAction: PropTypes.func.isRequired,
  rejectFriendAction: PropTypes.func.isRequired,
};

Search.defaultProps = {
  data: {
    search: [],
  },
};

export default compose(
  withStyles(s),
  graphql(searchPageQuery, {
    options: props => ({
      variables: {
        keyword: props.query.keyword,
      },
    }),
  }),
  graphql(sendFriendRequestMutation, {
    props: ({ mutate }) => ({
      sendFriendRequest: _id => mutate({
        variables: { _id },
      }),
    }),
  }),
  graphql(cancelFriendRequestedMutation, {
    props: ({ mutate }) => ({
      cancelFriendRequested: _id => mutate({
        variables: { _id },
      }),
    }),
  }),
  graphql(sendUnfriendRequestMutation, {
    props: ({ mutate }) => ({
      sendUnfriendRequest: _id => mutate({
        variables: { _id },
      }),
    }),
  }),
  graphql(acceptFriendOnSearchPageMutation, {
    props: ({ mutate }) => ({
      acceptFriendAction: _id => mutate({
        variables: { _id },
      }),
    }),
  }),
  graphql(rejectFriendOnSearchPageMutation, {
    props: ({ mutate }) => ({
      rejectFriendAction: _id => mutate({
        variables: { _id },
      }),
    }),
  }),
)(Search);
