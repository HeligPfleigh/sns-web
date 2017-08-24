import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem,
  Dropdown,
} from 'react-bootstrap';

import {
  PUBLIC,
  FRIEND,
  ONLY_ME,
  ONLY_ADMIN_BUILDING,
} from '../../constants';

export default class Privacy extends Component {
  /**
   *
   * @param {*} args
   */
  constructor(...args) {
    super(...args);

    this.state = {
      privacySelected: PUBLIC,
    };

    this.onSelect = this.onSelect.bind(this);
  }

  /**
   *
   */
  onSelect(privacySelected, event) {
    event.preventDefault();

    if ([PUBLIC, FRIEND, ONLY_ME, ONLY_ADMIN_BUILDING].indexOf(privacySelected) === -1) {
      privacySelected = PUBLIC;
    }
    this.setState({
      privacySelected,
    });

    this.props.onSelect(privacySelected, event);
  }

  /**
   *
   */
  getCurrentValue() {
    return this.state.privacySelected;
  }

  /**
   *
   */
  render() {
    const privacies = {
      PUBLIC: {
        icon: <i className="fa fa-globe" aria-hidden="true"></i>,
        label: 'Công khai',
        display: this.props.PUBLIC,
      },
      FRIEND: {
        icon: <i className="fa fa-users" aria-hidden="true"></i>,
        label: 'Bạn bè',
        display: this.props.FRIEND,
      },
      ONLY_ME: {
        icon: <i className="fa fa-lock" aria-hidden="true"></i>,
        label: 'Chỉ mình tôi',
        display: this.props.ONLY_ME,
      },
      ONLY_ADMIN_BUILDING: {
        icon: <i className="fa fa-building" aria-hidden="true"></i>,
        label: 'Quản lý tòa nhà',
        display: this.props.ADMIN_BUILDING,
      },
    };

    const privacyKeys = Object.keys(privacies);
    const keySelected = privacyKeys.indexOf(this.state.privacySelected);
    const selectedKey = keySelected > -1 ? privacyKeys[keySelected] : PUBLIC;
    const selectedLabel = privacies[selectedKey].label;
    const selectedIcon = privacies[selectedKey].icon;
    delete privacies[selectedKey];

    return (
      <Dropdown id={this.props.id} className={this.props.className}>
        <Dropdown.Toggle>{ selectedIcon } { selectedLabel }</Dropdown.Toggle>
        <Dropdown.Menu onSelect={this.onSelect}>
          { Object.keys(privacies).map(type => privacies[type].display && <MenuItem key={type} eventKey={type}>{ privacies[type].icon } { privacies[type].label }</MenuItem>) }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

Privacy.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.any,
  PUBLIC: PropTypes.bool.isRequired,
  FRIEND: PropTypes.bool.isRequired,
  ONLY_ME: PropTypes.bool.isRequired,
  ADMIN_BUILDING: PropTypes.bool.isRequired,
};

Privacy.defaultProps = {
  id: Math.random(),
  onSelect: () => undefined,
  PUBLIC: true,
  FRIEND: true,
  ONLY_ME: true,
  ADMIN_BUILDING: false,
};

