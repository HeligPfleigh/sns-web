import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../Link';
import s from './BuildingAnnouncementList.scss';

const BuildingAnnouncementList = ({ children, buildingId, user }) => {
  return (
    <div className={s.buildingAnnouncementList}>
      <ul>{children}</ul>
      <div className={s.buildingAnnouncementListFooter}>
        { user && !user.isAdmin &&
          <Link to={'/announcements'} style={{ textDecoration: 'none', color: '#337ab7' }}>
            Xem thêm
          </Link>
        }
        { user && user.isAdmin &&
          <Link to={`/management/${buildingId}/announcements_management`} style={{ textDecoration: 'none', color: '#337ab7' }}>
            Xem thêm
          </Link>
        }
      </div>
    </div>
  );
};

BuildingAnnouncementList.propTypes = {
  children: PropTypes.node,
  buildingId: PropTypes.string,
  user: PropTypes.object.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
)(BuildingAnnouncementList);
