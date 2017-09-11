import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
import s from './styles.scss';

class Annoucements extends Component {

  goDetail = (evt, id) => {
    if (evt) evt.preventDefault();
    history.push(`/announcement/${id}`);
  }

  goAnnoucePage = (evt) => {
    if (evt) evt.preventDefault();
    history.push('/announcements');
  }

  render() {
    const { isNew, announcements } = this.props;

    // className={classNames(s.red)}

    return (
      <div className={classNames(s.boxContent, isNew ? s.bgOrange : '')}>
        { isNew && <h2 className={classNames(s.title)}>Thông báo mới nhất</h2> }
        {
          !isNew && <h2 className={classNames(s.title)}>
            Các thông báo khác <a
              href="#"
              className={classNames(s.link)}
              onClick={this.goAnnoucePage}
            >{'Xem thêm >>'}</a>
          </h2>
        }
        <ul className={classNames(s.listItem, s.thongBao)}>
          { (announcements || []).map(item => (
            <li key={Math.random()}>
              <a href="#" onClick={evt => this.goDetail(evt, item._id)}>
                <i className={classNames('fa fa-bell-o')}></i>
                <h3>{item.message}</h3>
                <p className={classNames(s.time)}>
                  { moment(item.date).format('[Vào lúc] HH:mm - [Ngày] LL')}
                </p>
              </a>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}

Annoucements.propTypes = {
  isNew: PropTypes.bool,
  announcements: PropTypes.array,
};

export default withStyles(s)(Annoucements);
