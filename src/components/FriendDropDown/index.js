import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Image, Button } from 'react-bootstrap';
import s from './FriendDropDownStyle.scss';


class FriendDropDown extends React.Component {
  static propTypes = {
    userName: PropTypes.string.isRequired,
    imgSrc: PropTypes.string,
    acceptAction: PropTypes.func,
    rejectAction: PropTypes.func,
  }
  render() {
    const { imgSrc, userName } = this.props;
    return (
      <div className={s.root}>
        <Image src={imgSrc} circle width={32} height={32} />
        <h5>{userName}</h5>
        <Button>Accept</Button>
        <Button>Reject</Button>
      </div>
    );
  }
}

export default withStyles(s)(FriendDropDown);
