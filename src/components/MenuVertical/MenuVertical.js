import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MenuVertical.scss';
import history from '../../core/history';

class MenuVertical extends Component {

  onRedirect = (url) => {
    // eslint-disable-next-line
    (!isEmpty(url)) && history.push(`${this.props.parentPath || ''}${url}`);
  }

  render() {
    const { pageKey, menus } = this.props;
    let parentPage = pageKey;
    let childPage = '';
    if (pageKey && (pageKey.split('>').length > 0)) {
      const pages = pageKey.split('>');
      parentPage = pages[0];
      childPage = pages[1];
    }

    return (
      <div className={s.wrapperMenu}>
        {
          (menus || []).map(menu => (
            <span key={menu.key}>
              <div
                onClick={() => this.onRedirect(menu.url)}
                className={parentPage === menu.key ? s.itemMenuSelected : ''}
              >
                <button>
                  <i className={menu.icon} aria-hidden="true"></i>
                  {menu.text}
                </button>
              </div>
              {
                (menu.children || []).map(child => (
                  <div
                    key={child.key}
                    onClick={() => this.onRedirect(child.url)}
                    className={childPage === child.key ? s.childMenuSelected : ''}
                  >
                    <button className={s.childMenu}>
                      <i className="fa fa-caret-right" aria-hidden="true"></i>
                      {child.text}
                    </button>
                  </div>
                ))
              }
            </span>
          ))
        }
      </div>
    );
  }
}

MenuVertical.propTypes = {
  menus: PropTypes.array.isRequired,
  parentPath: PropTypes.string.isRequired,
  pageKey: PropTypes.string.isRequired,
};

export default withStyles(s)(MenuVertical);

