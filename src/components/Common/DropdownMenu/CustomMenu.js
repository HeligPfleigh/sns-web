import React from 'react';
import { Image } from 'react-bootstrap';
import Link from '../../Link';

class CustomMenu extends React.Component {
  static propTypes = {
    user: React.PropTypes.any,
    children: React.PropTypes.any,
  }

  render() {
    const { user: { profile } } = this.props;

    return (
      <div className="dropdown-menu" style={{ padding: '' }}>
        <div>
          <Link to="/me">
            <Image src={profile && profile.picture} circle width={32} height={32} />
          </Link>
        </div>
        <ul className="list-unstyled">
          {this.props.children}
        </ul>
      </div>
    );
  }
}

export default CustomMenu;
