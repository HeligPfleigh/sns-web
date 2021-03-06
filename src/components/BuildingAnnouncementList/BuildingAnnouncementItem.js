import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import Link from '../Link';
import s from './BuildingAnnouncementItem.scss';

class BuildingAnnouncementItem extends Component {

  edit = (evt) => {
    evt.preventDefault();
    const {
      onEdit,
      data,
    } = this.props;
    if (onEdit) {
      onEdit(data);
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
    const {
      data: {
        _id,
        date,
      },
      message,
      privacy,
      displayAction,
    } = this.props;
    let url = `/announcement/${_id}`;
    if (privacy) {
      url = `${url}?privacy=${privacy}`;
    }
    return (
      <li>
        <div className={s.buildingAnnouncementItem}>
          <Link to={url} style={{ textDecoration: 'none' }}>
            <div className={s.buildingAnnouncementIcon}>
              <i className="fa fa-bell-o" aria-hidden="true"></i>
            </div>
            <div className={s.buildingAnnouncementInfo}>
              <strong>{message}</strong>
              <br />
              <small>{moment(date).format('HH:mm  DD/MM/YYYY')}</small>
            </div>
          </Link>
          { displayAction && <div className={s.buildingAnnouncementButtons}>
            <Button
              bsStyle="default"
              onClick={this.edit}
              style={{ border: 'none' }}
            >
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </Button>
            <Button
              bsStyle="default"
              onClick={this.delete}
              style={{ border: 'none' }}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </Button>
          </div>
          }
        </div>
      </li>
    );
  }
}

BuildingAnnouncementItem.propTypes = {
  privacy: PropTypes.string,
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
