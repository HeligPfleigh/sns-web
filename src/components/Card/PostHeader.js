import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Col,
  Dropdown,
} from 'react-bootstrap';
import { generate as idRandom } from 'shortid';
import s from './PostHeader.scss';

// class CustomToggle extends React.Component {
//   constructor(props, context) {
//     super(props, context);

//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick(e) {
//     e.preventDefault();

//     this.props.onClick(e);
//   }

//   render() {
//     return (
//       <a href="" onClick={this.handleClick}>
//         {this.props.children}
//       </a>
//     );
//   }
// }

const CustomToggle = ({ onClick, children }) => (
  <a onClick={onClick}>
    { children }
  </a>
);

CustomToggle.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

const PostHeader = ({ avatar, title, subtitle, menuRight }) => (
  <div>
    <Col className={s.postHeaderLeft}>
      <div className={s.avarta}>
        { avatar }
      </div>
      <div className={s.userInfo}>
        { title }
        <br />
        { subtitle }
        <br />
      </div>
    </Col>
    <Col className={s.postHeaderRight}>
      <Dropdown id={idRandom()} pullRight>
        <CustomToggle bsRole="toggle">
          <span title="Tùy chọn">
            <i className="fa fa-circle-o" aria-hidden="true"></i>
            <i className="fa fa-circle-o" aria-hidden="true"></i>
            <i className="fa fa-circle-o" aria-hidden="true"></i>
          </span>
        </CustomToggle>
        { menuRight }
      </Dropdown>
    </Col>
  </div>
);

PostHeader.propTypes = {
  avatar: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  menuRight: PropTypes.node,
};

export default withStyles(s)(PostHeader);
