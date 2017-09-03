import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { Grid, Row, Col } from 'react-bootstrap';
import announcementQuery from './announcementQuery.graphql';
import s from './AnnouncementDetail.scss';

class AnnouncementDetail extends Component {
  render() {
    const {
      data: {
        announcement,
      },
    } = this.props;
    return (
      <Grid>
        <Row>
          <Col md={8} sm={12} xs={12} className={s.container}>
            {announcement &&
              <div className={s.announcement}>
                <div className={s.announcementTitle}>
                  <span>{announcement.message}</span>
                  <br />
                  <small>{moment(announcement.date).format('HH:mm  DD/MM/YYYY')}</small>
                </div>
                <div>
                  <p>{announcement.description}</p>
                </div>
              </div>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

AnnouncementDetail.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default compose(
  withStyles(s),
  graphql(announcementQuery, {
    options: props => ({
      variables: {
        announcementId: props.announcementId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(AnnouncementDetail);
