
  import React, { PropTypes } from 'react';
  import { Button } from 'react-bootstrap';
  import withStyles from 'isomorphic-style-loader/lib/withStyles';
  import s from './Info.scss';

  class Info extends React.Component {

    static propTypes = {
      profile: PropTypes.object.isRequired,


    };

    render() {
      const {  address, email, gender, birthday, phone  } = this.props.profile;

      return (
        <div className={s.root}>
          <ul className={s.profile}>
            <li className={s.fixfont}>
              <i className="fa fa-mobile fa-3x " aria-hidden="true"></i><span>Số điện thoại</span>      {phone || ''}
            </li>
            <li>
              <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
              <span>Địa Chỉ         </span>              {address || ''}
            </li>
            <li>
              <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
              <span>Email </span>                   { email || ''}
            </li>
            <li>
              <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
              <span>Giới tính          </span>               {gender || ''}
            </li>
            <li>
              <i className="fa fa-birthday-cake fa-2x" aria-hidden="true"></i>
              <span>Ngày Sinh          </span>                {birthday || ''}
            </li>
            <li><Button className={s.button} >Thay đổi thông tin</Button></li>
          </ul>
        </div>


      );
    }
}

  export default withStyles(s)(Info);
