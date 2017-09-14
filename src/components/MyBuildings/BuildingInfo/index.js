import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
import s from './styles.scss';

class BuildingInfo extends Component {

  goUserPage = (evt, id) => {
    if (evt) evt.preventDefault();
    history.push(`/user/${id}`);
  }

  render() {
    const { buildingInfo, admins } = this.props;

    return (
      <div className={classNames(s.boxContent)}>
        <h2 className={classNames(s.title)}>Thông tin chung cư</h2>
        <div className={classNames(s.buildingInfo)}>
          <h3>{ buildingInfo.name }</h3>
          <p>{ buildingInfo.addressString || 'Chưa rõ địa chỉ' }</p>
        </div>
        <div className={classNames(s.admins)}>
          <strong>Ban quản lý</strong>
          <ul className={classNames(s.listItem)}>
            { (admins || []).map((item) => {
              const gender = item.profile.gender === 'male' ? 'Ông' : 'Bà';
              return (
                <li key={Math.random()}>
                  <a href="#" onClick={evt => this.goUserPage(evt, item._id)}>
                    {`${gender} ${item.profile.fullName}`}
                  </a>
                </li>
              );
            }) }
          </ul>
        </div>
      </div>
    );
  }
}

BuildingInfo.propTypes = {
  admins: PropTypes.array,
  buildingInfo: PropTypes.object,
};

export default withStyles(s)(BuildingInfo);
