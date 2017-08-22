import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MenuVertical.scss';

class MenuVertical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectItem: 0,
    };
  }

  onItemSelected = (idx) => {
    if (this.state.selectItem !== idx) {
      this.setState({
        selectItem: idx,
      });
      this.props.onItemSelected(idx);
    }
  }

  render() {
    const { menus } = this.props;
    const { selectItem } = this.state;
    return (
      <div className={s.wrapperMenu}>
        {
          menus.map((menu, idx) => (
            <div
              className={selectItem === idx ? s.itemMenuSelected : s.itemMenu}
              key={menu.key}
              onClick={() => { this.onItemSelected(idx); }}
            >
              <button>{menu.text}</button>
            </div>
          ))
        }
      </div>
    );
  }
}

MenuVertical.propTypes = {
  menus: PropTypes.array.isRequired,
  onItemSelected: PropTypes.func.isRequired,
};

export default withStyles(s)(MenuVertical);

