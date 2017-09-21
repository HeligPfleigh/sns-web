import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import { generate as idRandom } from 'shortid';
import { Grid, Row, Col } from 'react-bootstrap';
import searchPageQuery from './searchPageQuery.graphql';
import sendFriendRequestMutation from '../FriendSuggestions/sendFriendRequestMutation.graphql';
import cancelFriendRequestedMutation from './cancelFriendRequestedMutation.graphql';
import SearchItem from './SearchItem';
import s from './Search.scss';

class Search extends Component {
  render() {
    const { data: { search }, query } = this.props;
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
                      sendFriendRequest={this.props.sendFriendRequest}
                      cancelFriendRequested={this.props.cancelFriendRequested}
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
)(Search);
