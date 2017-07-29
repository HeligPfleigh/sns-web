import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import buildingNotificationQuery from './buildingNotificationQuery.graphql';
import BuildingAnnouncementList, {
  BuildingAnnouncementHeader,
  BuildingAnnouncementItem,
} from './BuildingAnnouncement';
import s from './BuildingNotification.scss';

const buildingNotification = [
  {
    type: 'type01',
    date: '11:00 AM  15 tháng 5',
    title: 'Thông báo tổ chức mùng 1-6 cho các bé',
  },
  {
    type: 'type01',
    date: '11:00 AM  15 tháng 4',
    title: 'Thông báo diễn tập phòng cháy chữa cháy',
  },
  {
    type: 'type02',
    date: '11:00 AM  01 tháng 4',
    title: 'Thông báo nộp tiền phí dịch vụ tháng 4',
  },
];

class BuildingNotification extends Component {
  render() {
    const { data: { loading, resident: { building } } } = this.props;
    return (
      <div>
        {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>}
        <BuildingAnnouncementList>
          <BuildingAnnouncementHeader />
          {
            !loading && building && building.announcements && building.announcements.edges.map(notification =>
              <BuildingAnnouncementItem
                key={notification._id}
                data={notification}
              />,
            )
          }
        </BuildingAnnouncementList>
      </div>
    );
  }
}

BuildingNotification.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(buildingNotificationQuery, {
    options: ownProps => ({
      variables: {
        userId: ownProps.user.id,
        cursor: null,
        limit: 3,
      },
      fetchPolicy: 'network-only',
    }),
  }),
)(BuildingNotification);
