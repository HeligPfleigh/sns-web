import React, { PropTypes } from 'react';
import { compose } from 'react-apollo';
import {
  Row,
  Col,
  Button,
  Image,
  Dropdown,
  MenuItem,
  Glyphicon,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { generate as idRandom } from 'shortid';
import moment from 'moment';
import * as _ from 'lodash';

import s from './EventDetail.scss';
import Divider from '../../Divider';
import history from '../../../core/history';

const PRIVARY_TEXT = {
  ONLY_ME: 'Chỉ mình tôi',
  PUBLIC: 'Công khai',
  FRIEND: 'Bạn bè',
};

const CustomToggle = ({ onClick, children }) => (
  <Button onClick={onClick}>
    { children }
  </Button>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

class EventDetail extends React.Component {

  constructor(...args) {
    super(...args);

    this.onJoinClick = this.onJoinClick.bind(this);
    this.onCanJoinClick = this.onCanJoinClick.bind(this);
    this.onCantJoinClick = this.onCantJoinClick.bind(this);
    this.onSelectEtcMenu = this.onSelectEtcMenu.bind(this);
    this.onInterestClick = this.onInterestClick.bind(this);
  }

  async onInterestClick(e) {
    e.preventDefault();
    // const { event, user } = this.props;
    // await this.props.joinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  async onJoinClick(e) {
    e.preventDefault();
    const { event, user } = this.props;
    await this.props.joinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  async onCanJoinClick(e) {
    e.preventDefault();
    const { event, user } = this.props;
    await this.props.canJoinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  async onCantJoinClick(e) {
    e.preventDefault();
    const { event, user } = this.props;
    await this.props.cantJoinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  onSelectEtcMenu = async (eventKey, event) => {
    event.preventDefault();
    if (eventKey === 'DELETE_EVENT') {
      await this.props.deleteEvent(this.props.event._id);
      history.push('/events');
    }
  }
  __renderButtons(isAuthor) {
    const { event, user } = this.props;
    const isJoined = _.isArray(event.joins) && event.joins.filter(u => u._id === user.id).length > 0;
    const isCanJoined = _.isArray(event.can_joins) && event.can_joins.filter(u => u._id === user.id).length > 0;
    const isCantJoined = _.isArray(event.cant_joins) && event.cant_joins.filter(u => u._id === user.id).length > 0;
    const ignore = !isAuthor && !isJoined && !isCanJoined && !isCantJoined && _.isArray(event.invites) && event.invites.filter(u => u._id === user.id).length === 0;

    if (isAuthor) {
      return (<div className={s.actionsButton}>
        <span>
          <Button onClick={this.props.onOpenInviteModal} className={s.btnLeft}>
            <i className="fa fa-envelope-o" aria-hidden="true"></i>
            <span>Mời</span>
          </Button>
          <Button className={s.btnMiddle}>
            <i className="fa fa-picture-o" aria-hidden="true"></i>
            <span>Thêm ảnh bìa</span>
          </Button>
          <Button className={s.btnMiddle}>
            <i className="fa fa-pencil" aria-hidden="true"></i>
            <span>Chỉnh sửa</span>
          </Button>
          <Dropdown
            className={s.btnRight}
            style={{ marginRight: '5px' }}
            id={idRandom()}
          >
            <CustomToggle bsRole="toggle">
              <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
            </CustomToggle>
            <Dropdown.Menu onSelect={this.onSelectEtcMenu}>
              <MenuItem eventKey="DELETE_EVENT">Xóa sự kiện</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </span>
      </div>);
    }

    if (ignore) {
      const isInterested = _.isArray(event.interests) && event.interests.filter(u => u._id === user.id).length > 0;
      return (<div className={s.actionsButton}>
        <Button onClick={this.onInterestClick} disabled={isInterested}>
          <Glyphicon glyph="star" /> <span>Quan tâm</span>
        </Button>
      </div>);
    }

    return (<div className={s.actionsButton}>
      <Button onClick={this.onJoinClick} className={s.btnLeft} disabled={isJoined}>
        <Glyphicon glyph="ok" /> <span>Tham gia</span>
      </Button>
      <Button onClick={this.onCanJoinClick} className={s.btnMiddle} disabled={isCanJoined}>
        <Glyphicon glyph="bookmark" /> <span>Có thể</span>
      </Button>
      <Button onClick={this.onCantJoinClick} className={s.btnRight} disabled={isCantJoined}>
        <Glyphicon glyph="remove" /> <span>Không tham gia</span>
      </Button>
    </div>);
  }

  render() {
    const { event } = this.props;
    const start = !event ? new Date() : new Date(event.start);
    const end = !event ? new Date() : new Date(event.end);
    return (
      <Row className={s.eventDetailContent}>
        {
          event &&
          <Col md={12}>
            <Col md={12} className={s.titleLayout}>
              <div className={s.left}>
                <h5>{`THÁNG ${start.getMonth() + 1}`}</h5>
                <h4>{start.getDate()}</h4>
              </div>
              <div className={s.right}>
                <h4>
                  {event.name}
                </h4>
                <h5>
                  {PRIVARY_TEXT[event.privacy]} - Tổ chức bởi <b>{`${event.author.profile.firstName} ${event.author.profile.lastName}`}</b>
                </h5>
                { this.__renderButtons(event.isAuthor) }
              </div>
            </Col>
            <Col md={12}>
              <Divider className={s.divider} />
              <div className={s.timeLocationLayout}>
                <p>
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                  {`${moment(start).calendar()} - ${moment(end).calendar()}`}
                </p>
                <p>
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  {` ${event.location}`}
                </p>
              </div>
              <Divider className={s.divider} />
              <div className={s.inviteLayout}>
                <div className={s.text}>
                  <h5>
                    {`${event.joins.length} người sẽ tham gia · ${event.can_joins.length} người có thể tham gia`}
                  </h5>
                  <div className={s.ListUserJoin}>
                    <div className={s.WrapperItemUsers}>
                      {
                        event.joins.map(item => (
                          <div key={Math.random()} className={s.ItemUserJoin}>
                            <Image
                              src={item.profile.picture}
                            />
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                {event.isAuthor && (<div className={s.btnInviteWrapper}>
                  <div>
                    <Button
                      onClick={this.props.onOpenInviteModal}
                      className={s.btnInvite}
                    >
                      <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      <span>Mời</span>
                    </Button>
                  </div>
                </div>)
                }
              </div>
              <Divider className={s.divider} />
              <div className={s.description}>
                <span >
                  <div dangerouslySetInnerHTML={{ __html: stateToHTML(convertFromRaw(JSON.parse(event.message))) }} />
                </span>
              </div>
            </Col>
          </Col>
          }
      </Row>
    );
  }
}

EventDetail.propTypes = {
  event: PropTypes.object.isRequired,
  onOpenInviteModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  joinEvent: PropTypes.func.isRequired,
  canJoinEvent: PropTypes.func.isRequired,
  cantJoinEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
)(EventDetail);
