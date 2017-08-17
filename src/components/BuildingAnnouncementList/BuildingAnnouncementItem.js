import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
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
      onDelete(data._id, data.message);
    }
  }

  render() {
    const {
      data: {
        type,
        date,
      },
      message,
      displayAction,
    } = this.props;
    return (
      <li>
        <div className={s.buildingAnnouncementItem}>
          <div className={s.buildingAnnouncementIcon}>
            <i className="fa fa-bullhorn fa-2x" style={{ backgroundColor: `${type === TYPE1 ? '#006400' : '#FF8C00'}` }} aria-hidden="true"></i>
          </div>
          <div className={s.buildingAnnouncementInfo}>
            <strong>{message}</strong>
            <br />
            <small>{moment(date).format('HH:mm DD/MM/YYYY')}</small>
          </div>
          { displayAction && <div className={s.buildingAnnouncementButtons}>
            <Button
              bsStyle="primary"
              onClick={this.edit}
              style={{ marginRight: '5px' }}
            >
              Edit
            </Button>
            <Button bsStyle="primary" onClick={this.delete} >Delete</Button>
          </div>
          }
        </div>
      </li>
    );
  }
}

BuildingAnnouncementItem.propTypes = {
  data: PropTypes.object,
  message: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  displayAction: PropTypes.bool,
};

BuildingAnnouncementItem.defaultProps = {
  displayAction: false,
};

export default withStyles(s)(BuildingAnnouncementItem);
