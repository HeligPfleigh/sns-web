import React, { PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  Row,
  Col,
  Button,
  Image,
  Dropdown,
  MenuItem,
} from 'react-bootstrap';
import moment from 'moment';
import Divider from '../../Divider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventDetail.scss';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { generate as idRandom } from 'shortid';
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

  onJoinClick = async () => {
    const { event, user } = this.props;
    const newInviteList = event.invites.filter(item => (item._id !== user.id));
    let newJoinList = [];
    newJoinList = event.joins.map(item => (item));
    let exist = false;
    newJoinList.forEach((element) => {
      if (element._id == user.id) {
        exist = true;
      }
    });
    if (!exist) {
      newJoinList.push({
        _id: user.id,
        profile: {
          picture: user.profile.picture,
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
        },
        username: user.username,
      });
    }
    await this.props.joinEvent(event._id, newInviteList, newJoinList);
  }

  onCanJoinClick = async () => {
    const { event, user } = this.props;
    const newInviteList = event.invites.filter(item => (item._id !== user.id));
    let newJoinList = [];
    newJoinList = event.joins.map(item => (item));
    await this.props.canJoinEvent(event._id, newInviteList, newJoinList);
  }

  onCantJoinClick = async () => {
    const { event, user } = this.props;
    const newInviteList = event.invites.filter(item => (item._id !== user.id));
    let newJoinList = [];
    newJoinList = event.joins.map(item => (item));
    await this.props.cantJoinEvent(event._id, newInviteList, newJoinList);
  }

  onSelectEtcMenu = async (eventKey, event) => {
    event.preventDefault();
    if (eventKey === 'DELETE_EVENT') {
      await this.props.deleteEvent(this.props.event._id);
      history.push('/events');
    }
  }

  render() {
    const { event, user } = this.props;
    const start = !event ? new Date() : new Date(event.start);
    const end = !event ? new Date() : new Date(event.end);
    return (
      <div className={s.eventDetailContent}>
        <Row>
          {
            event &&
            <Col md={12}>
              <div className={s.titleLayout}>
                <div className={s.left}>
                  <h5>{`THÁNG ${start.getMonth()}`}</h5>
                  <h4>{start.getDay()}</h4>
                </div>
                <div className={s.right}>
                  <h4>
                    {event.name}
                  </h4>
                  <h5>
                    {PRIVARY_TEXT[event.privacy]} - Tổ chức bởi <b>{`${event.author.profile.firstName} ${event.author.profile.lastName}`}</b>
                  </h5>
                  {
                    user.id == event.author._id ? <div className={s.actionsButton}>
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
                    </div> : <div className={s.actionsButton}>
                      <Button onClick={this.onJoinClick} className={s.btnLeft}>
                        <span>Tham gia</span>
                      </Button>
                      <Button onClick={this.onCanJoinClick} className={s.btnMiddle}>
                        <span>Có thể</span>
                      </Button>
                      <Button onClick={this.onCantJoinClick} className={s.btnRight}>
                        <span>Không tham gia</span>
                      </Button>
                    </div>
                  }
                </div>
              </div>
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
                      {`${!event.joins ? 0 : event.joins.length} Người sẽ tham gia - Đã mời ${!event.invites ? 0 : event.invites.length}`}
                    </h5>
                    <div className={s.ListUserJoin}>
                      <div className={s.WrapperItemUsers}>
                        {
                          event.joins.map(item => (
                            <div className={s.ItemUserJoin}>
                              <Image
                                src={item.profile.picture}
                              />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  {user.id == event.author._id &&
                    <div className={s.btnInviteWrapper}>
                      <div>
                        <Button
                          onClick={this.props.onOpenInviteModal}
                          className={s.btnInvite}
                        >
                          <i className="fa fa-envelope-o" aria-hidden="true"></i>
                          <span>Mời</span>
                        </Button>
                      </div>
                    </div>
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
      </div>
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
