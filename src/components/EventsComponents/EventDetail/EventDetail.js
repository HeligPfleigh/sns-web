import React, { PropTypes } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import moment from 'moment';
import Divider from '../../Divider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventDetail.scss';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const PRIVARY_TEXT = {
  ONLY_ME: 'Chỉ mình tôi',
  PUBLIC: 'Công khai',
  FRIEND: 'Bạn bè',
};

class EventDetail extends React.Component {
  render() {
    const { event } = this.props;
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
                  <div className={s.actionsButton}>
                    <Button className={s.btnLeft}>
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
                    <Button className={s.btnRight}>
                      <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </Button>
                  </div>
                </div>
              </div>
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
                    {`${!event.joins.edges ? 0 : event.joins.edges.length} Người sẽ tham gia - Đã mời ${!event.invites.edges ? 0 : event.invites.edges.length}`}
                  </h5>
                  <span>
                  Mời bạn bè tham gia sự kiện
                </span>
                </div>
                <div className={s.btnInviteWrapper}>
                  <div>
                    <Button className={s.btnInvite}>
                      <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      <span>Mời</span>
                    </Button>
                  </div>
                </div>
              </div>
              <Divider className={s.divider} />
              <div className={s.description}>
                <span >
                  <div dangerouslySetInnerHTML={{ __html: stateToHTML(convertFromRaw(JSON.parse(event.message))) }} />
                </span>
              </div>

            </Col>
           }
        </Row>

      </div>
    );
  }
}

EventDetail.propTypes = {
  event: PropTypes.object.isRequired,
};

export default compose(
  withStyles(s),
)(EventDetail);
