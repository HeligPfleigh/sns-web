import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
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
import { generate as idRandom } from 'shortid';
import isArray from 'lodash/isArray';

import { DraftToHTML } from '../../Editor';
import Validator from '../../Validator';
import Divider from '../../Divider';
import history from '../../../core/history';
import EditEventModal from '../EditEvent';
import CancelEventModal from '../CancelEvent';
import { openAlertGlobal } from '../../../reducers/alert';
import s from './EventDetail.scss';

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

class EventDetail extends Component {

  constructor(props, ...args) {
    super(props, ...args);

    this.state = this.initState();

    // this.canUpdateEventId = setInterval(() => {
    //   this.setState({
    //     canUpdateEvent: this.canUpdateEvent(),
    //   });
    // }, 5000);
    // this.canDeleteEventId = setInterval(() => {
    //   this.setState({
    //     canDeleteEvent: this.canDeleteEvent(),
    //   });
    // }, 5000);
  }

  componentWillMount() {
    this.setState({
      canUpdateEvent: this.canUpdateEvent(),
      canDeleteEvent: this.canDeleteEvent(),
    });
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.setState({
        canUpdateEvent: this.canUpdateEvent(),
        canDeleteEvent: this.canDeleteEvent(),
      });
    }, 500);
  }

  onInterestClicked = async (e) => {
    e.preventDefault();
    const { interestEvent, event } = this.props;
    await interestEvent(event._id);
  }

  onDisInterestClicked = async () => {
    const { disInterestEvent, event } = this.props;
    await disInterestEvent(event._id);
  }

  onJoinClick = async (e) => {
    e.preventDefault();
    const { event, user, joinEvent } = this.props;
    await joinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  onCanJoinClick = async (e) => {
    e.preventDefault();
    const { event, user, canJoinEvent } = this.props;
    await canJoinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  onCantJoinClick = async (e) => {
    e.preventDefault();
    const { event, user, cantJoinEvent } = this.props;
    await cantJoinEvent(event._id, event.invites.filter(item => !(item._id === user.id)), event.joins.map(item => item));
  }

  onDropDown = async (eventKey, e) => {
    e.preventDefault();
    if (eventKey === 'DELETE_EVENT') {
      const { deleteEvent, event } = this.props;
      await deleteEvent(event._id);
      history.push('/events');
    }
  }

  cancelEvent = (eventId) => {
    const { openAlertGlobalAction } = this.props;

    this.setState({
      showEditFormModal: false,
      showCancelEvent: false,
    });

    this.props
    .cancelEvent(eventId)
    .then(() => {
      openAlertGlobalAction({
        message: 'Bạn đã hủy sự kiện thành công và bạn không thể chỉnh sửa chi tiết của sự kiện này.',
        open: true,
        autoHideDuration: 0,
      });
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  }

  canUpdateEvent = () => {
    const { event } = this.props;
    return event.isAuthor && Validator.Date.isValid(event.start) && Validator.Date.withMoment(event.start) > Validator.Date.now();
  }

  canDeleteEvent = () => {
    const { event } = this.props;
    const now = Validator.Date.now();
    return event.isAuthor &&
      (
        (Validator.Date.isValid(event.start) && (Validator.Date.withMoment(event.start) > now))
        || (Validator.Date.isValid(event.end) && (Validator.Date.withMoment(event.end) < now))
      );
  }

  showEditEventModal = () => {
    this.setState({
      showEditFormModal: true,
    });
  }

  showCancelEventModal= () => {
    this.setState({
      showCancelEvent: true,
    });
  }

  initState = () => ({
    showEditFormModal: false,
    showCancelEvent: false,
    canUpdateEvent: false,
    canDeleteEvent: false,
  })

  hideEditEventModal = () => {
    this.setState({
      showEditFormModal: false,
    });
  }

  hideCancelEventModal = () => {
    this.setState({
      showCancelEvent: false,
    });
  }

  __renderButtons(isAuthor) {
    const { event, user } = this.props;
    const isJoined = isArray(event.joins) && event.joins.filter(u => u._id === user.id).length > 0;
    const isCanJoined = isArray(event.can_joins) && event.can_joins.filter(u => u._id === user.id).length > 0;
    const isCantJoined = isArray(event.cant_joins) && event.cant_joins.filter(u => u._id === user.id).length > 0;
    const ignore = !isAuthor && !isJoined && !isCanJoined && !isCantJoined && isArray(event.invites) && event.invites.filter(u => u._id === user.id).length === 0;
    if (isAuthor) {
      return (<div className={s.actionsButton}>
        <span>
          <Button onClick={this.props.onOpenInviteModal} className={s.btnLeft} disabled={event.isCancelled}>
            <i className="fa fa-envelope-o" aria-hidden="true"></i>
            <span>Mời</span>
          </Button>
          <Button className={s.btnMiddle} disabled={event.isCancelled}>
            <i className="fa fa-picture-o" aria-hidden="true"></i>
            <span>Thêm ảnh bìa</span>
          </Button>
          <Button className={s.btnMiddle} onClick={this.showEditEventModal} disabled={!this.state.canUpdateEvent || event.isCancelled}>
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
            <Dropdown.Menu onSelect={this.onDropDown}>
              <MenuItem eventKey="DELETE_EVENT" disabled={!this.state.canDeleteEvent || event.isCancelled}>Xóa sự kiện</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </span>
      </div>);
    }

    if (ignore) {
      const isInterested = isArray(event.interests) && event.interests.filter(u => u._id === user.id).length > 0;
      return (
        <div className={s.actionsButton}>
          {
            !isInterested ?
              <Button
                onClick={this.onInterestClicked}
                disabled={event.isCancelled}
              >
                <i className="fa fa-star" aria-hidden="true" style={{ marginRight: 5 }}></i>
                Quan tâm
              </Button> :
              <Button
                onClick={this.onDisInterestClicked}
              >
                <i className="fa fa-star" aria-hidden="true" style={{ marginRight: 5 }}></i>
                Hủy quan tâm
              </Button>
          }
        </div>
      );
    }

    return (<div className={s.actionsButton}>
      <Button onClick={this.onJoinClick} className={s.btnLeft} disabled={isJoined || event.isCancelled}>
        <Glyphicon glyph="ok" /> <span>Tham gia</span>
      </Button>
      <Button onClick={this.onCanJoinClick} className={s.btnMiddle} disabled={isCanJoined || event.isCancelled}>
        <Glyphicon glyph="bookmark" /> <span>Có thể</span>
      </Button>
      <Button onClick={this.onCantJoinClick} className={s.btnRight} disabled={isCantJoined || event.isCancelled}>
        <Glyphicon glyph="remove" /> <span>Không tham gia</span>
      </Button>
    </div>);
  }

  render() {
    const { event: { ...eventData } } = this.props;
    eventData.start = Validator.Date.withMoment(eventData.start);
    eventData.end = Validator.Date.withMoment(eventData.end);
    return (
      <Row className={s.eventDetailContent}>
        <EditEventModal
          show={this.state.showEditFormModal}
          onHide={this.hideEditEventModal}
          onUpdate={this.props.editEvent}
          showCancelEventModal={this.showCancelEventModal}
          canUpdate={this.state.canUpdateEvent}
          canDelete={this.state.canDeleteEvent}
          initialValues={eventData}
          isHideModalBehindBackdrop={this.state.showCancelEvent}
        />
        <CancelEventModal
          eventId={eventData._id}
          show={this.state.showCancelEvent}
          closeModal={this.hideCancelEventModal}
          onDelete={this.props.deleteEvent}
          onCancel={this.cancelEvent}
        />
        {
          eventData &&
          <Col md={12}>
            <Col md={12} className={s.titleLayout}>
              <Col xs={2} className={s.left}>
                <div className={s.month}>{eventData.start.format('MMMM')}</div>
                <div className={s.day}>{eventData.start.format('DD')}</div>
              </Col>
              <Col xs={10} className={s.right}>
                <h4>{eventData.name}</h4>
                <h5>
                  {PRIVARY_TEXT[eventData.privacy]} - Tổ chức bởi <b>{`${eventData.author.profile.firstName} ${eventData.author.profile.lastName}`}</b>
                </h5>
                { this.__renderButtons(eventData.isAuthor) }
              </Col>
            </Col>
            <Col md={12}>
              <Divider className={s.divider} />
              <div className={s.timeLocationLayout}>
                <p className={(eventData.isCancelled ? s.cancelledEvent : '')}>
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                  {`${eventData.start.calendar()} - ${eventData.end.calendar()}`}
                </p>
                <p className={(eventData.isCancelled ? s.cancelledEvent : '')}>
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  {` ${eventData.location}`}
                </p>
              </div>
              <Divider className={s.divider} />
              <div className={s.inviteLayout}>
                <div className={s.text}>
                  <h5>
                    {`${eventData.joins.length} người sẽ tham gia · ${eventData.can_joins.length} người có thể tham gia`}
                  </h5>
                  <div className={s.ListUserJoin}>
                    <div className={s.WrapperItemUsers}>
                      {
                        eventData.joins.map(item => (
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
                {eventData.isAuthor && (<div className={s.btnInviteWrapper}>
                  <div>
                    <Button
                      onClick={this.props.onOpenInviteModal}
                      className={s.btnInvite}
                      disabled={eventData.isCancelled}
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
                  <div dangerouslySetInnerHTML={{ __html: DraftToHTML(eventData.message) }} />
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
  editEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  // joinEvent: PropTypes.func.isRequired,
  // canJoinEvent: PropTypes.func.isRequired,
  // cantJoinEvent: PropTypes.func.isRequired,
  interestEvent: PropTypes.func.isRequired,
  disInterestEvent: PropTypes.func.isRequired,
  openAlertGlobalAction: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  connect(
    null,
    { openAlertGlobalAction: openAlertGlobal },
  ),
)(EventDetail);
