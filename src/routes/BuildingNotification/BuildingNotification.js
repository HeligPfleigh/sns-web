import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import BuildingNotificationItem from './BuildingNotificationItem';
import Label from '../../components/Friend/Label';
import buildingNotificationQuery from './buildingNotificationQuery.graphql';
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
    // const { data: { loading } } = this.props;
    // console.log(this.props, 'this.props');
    return (
      <div>
        {/* {loading && <h1 style={{ textAlign: 'center' }}>Đang tải dữ liệu</h1>} */}
        {/* {!loading && <FriendsList>
          <li style={{ paddingLeft: '10px' }}>
            <Label label="Thông báo" />
          </li>
        </FriendsList>
        } */}
        <div className={s.buildingNotificationList}>
          <ul>
            <li style={{ backgroundColor: '#FF8C00', height: '10px', marginBottom: '5px' }}></li>
            {
              buildingNotification.map(notification =>
                <BuildingNotificationItem
                  notification={notification}
                />,
              )
            }
          </ul>
          <div className={s.buildingNotificationListFooter}>
            Xem thêm
          </div>
        </div>
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
  // graphql(buildingNotificationQuery, {
  //   options: ownProps => ({
  //     variables: {
  //       _id: ownProps.user.id,
  //       cursor: null,
  //     },
  //     fetchPolicy: 'network-only',
  //   }),
  // }),
)(BuildingNotification);
