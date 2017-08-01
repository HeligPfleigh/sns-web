import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { generate as idRandom } from 'shortid';
import { Grid, Row, Col } from 'react-bootstrap';
import Link from '../../components/Link';
import s from './Search.scss';


const searchPageQuery = gql`query searchPageQuery ($keyword: String!, $numberOfFriends: Int) {
  search (keyword: $keyword, numberOfFriends: $numberOfFriends ){
    _id
    profile {
      picture
      firstName
      lastName
    }
  }
}`;

class Search extends React.Component {
  render() {
    const { data: { search } } = this.props;
    return (
      <Grid>
        <Row className={s.top20}>
          <Col md={8} sm={12} xs={12}>
            <div className={s.friendsList}>
              {
                search && search.length > 0 && search.map(item => (
                  <div key={idRandom()} className={s.friendsContent}>
                    <Link to={`/user/${item._id}`} style={{ textDecoration: 'none' }}>
                      <img className={s.friendsAvatar} src={item.profile.picture} />
                      <span className={s.friendsName}>
                        {item.profile.firstName} {item.profile.lastName}
                      </span>
                    </Link>
                  </div>
              ))}
              {
                search && search.length === 0 &&
                <div className={s.friendsContent}>
                  Không tìm thấy kết quả
                </div>
              }
            </div>
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
)(Search);
