import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import {
  TYPE1,
} from '../../constants';
import s from './BuildingAnnouncementItem.scss';

class BuildingAnnouncementItem extends Component {

  edit = (evt) => {
    evt.preventDefault();
    const {
      onEdit,
      data,
    } = this.props;
    if (onEdit) {
      onEdit(data._id, data.message, data.type);
    }
  }

  delete = (evt) => {
    evt.preventDefault();
    const {
      onDelete,
      data,
    } = this.props;
    if (onDelete) {
      onDelete(data._id);
    }
  }

  render() {
    const { data, displayAction } = this.props;

    return (
      <li>
        <div className={s.buildingAnnouncementItem}>
          <div className={s.buildingAnnouncementIcon}>
            <i className="fa fa-bullhorn fa-2x" style={{ backgroundColor: `${data.type === TYPE1 ? '#006400' : '#FF8C00'}` }} aria-hidden="true"></i>
          </div>
          <div className={s.buildingAnnouncementInfo}>
            <strong>{data.message}</strong>
            <br />
            <small>{moment(data.date).format('HH:mm DD/MM/YYYY')}</small>
          </div>
          { displayAction && <div className="pull-right">
            <a className="btn btn-xs btn-white" onClick={this.edit}>
              <i className="fa fa-thumbs-up"></i>Edit
            </a>
            <a className="btn btn-xs btn-white" onClick={this.delete}>
              <i className="fa fa-thumbs-up"></i>Delete
            </a>
          </div>
          }
        </div>
      </li>
    );
  }
}

BuildingAnnouncementItem.propTypes = {
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  displayAction: PropTypes.bool,
};

BuildingAnnouncementItem.defaultProps = {
  displayAction: false,
};

export default withStyles(s)(BuildingAnnouncementItem);
