import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withApollo } from 'react-apollo';
import { isNumber, toNumber } from 'lodash';
import {
  Button,
  FormControl,
  FormGroup,
  Radio,
  Col,
} from 'react-bootstrap';
import s from './InfoTab.scss';
import {
  MALE,
  FEMALE,
  // GENDER,
} from '../../../constants';
import updateProfileMutation from './updateProfileMutation.graphql';

class InfoTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      firstName: props.profile.firstName,
      lastName: props.profile.lastName,
      gender: props.profile.gender,
      errorFirstname: false,
      errorLastName: false,
      errorMessage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      firstName: nextProps.profile.firstName,
      lastName: nextProps.profile.lastName,
      gender: nextProps.profile.gender,
    });
  }

  openInfoUpdate = (evt) => {
    evt.preventDefault();
    const {
      userId,
      queryData,
      paramData,
    } = this.props;
    const {
      firstName,
      lastName,
    } = this.state;
    this.props.client.mutate({
      mutation: updateProfileMutation,
      variables: {
        input: {
          userId,
          profile: {
            firstName,
            lastName,
            gender: MALE,
          },
        },
      },
      update: (store, { data: { updateUserProfile } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: queryData,
          variables: paramData,
        });

        data.resident.profile.firstName = updateUserProfile.user.profile.firstName;
        data.resident.profile.lastName = updateUserProfile.user.profile.lastName;
        data.resident.profile.gender = updateUserProfile.user.profile.gender;

        // Write our data back to the cache.
        store.writeQuery({
          query: queryData,
          variables: paramData,
          data,
        });
      },
    });
  }

  handleChangeLastName = (e) => {
    const ln = e.target.value;
    if (!/^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/g.test(ln)) {
      this.setState({
        lastName: ln,
        errorLastName: true,
        errorMessage: 'Các ký tự đặc biệt và số không được cho phép',
      });
    } else if (ln.length === 0) {
      this.setState({
        lastName: ln,
        errorLastName: true,
        errorMessage: 'Vui lòng điền đầy đủ thông tin',
      });
    } else if (ln.length === 1) {
      this.setState({
        lastName: ln,
        errorLastName: true,
        errorMessage: 'Bạn điền quá ít',
      });
    } else if (ln.length > 15) {
      this.setState({
        lastName: ln,
        errorLastName: true,
        errorMessage: 'Bạn điền quá nhiều từ',
      });
    } else {
      this.setState({
        lastName: ln,
        errorLastName: false,
      });
    }
  }

  handleChangeFirstName = (e) => {
    const ln = e.target.value;
    if (!/^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/g.test(ln)) {
      this.setState({
        firstName: ln,
        errorFirstname: true,
        errorMessage: 'Các ký tự đặc biệt và số không được cho phép',
      });
    } else if (ln.length === 0) {
      this.setState({
        firstName: ln,
        errorFirstname: true,
        errorMessage: 'Vui lòng điền đầy đủ thông tin',
      });
    } else if (ln.length === 1) {
      this.setState({
        firstName: ln,
        errorFirstname: true,
        errorMessage: 'Bạn điền quá ít',
      });
    } else if (ln.length > 15) {
      this.setState({
        firstName: ln,
        errorFirstname: true,
        errorMessage: 'Bạn điền quá nhiều từ',
      });
    } else {
      this.setState({
        firstName: ln,
        errorFirstname: false,
      });
    }
  }

  render() {
    const { errorFirstname, errorLastName, errorMessage } = this.state;
    return (
      <div className={s.root}>
        <form>
          <ul className={s.profile}>
            <li>
              <Col sm={2} className={s.profileLeft}>
                <i className="fa fa-address-book-o fa-2x" aria-hidden="true"></i>
                <span>Họ</span>
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  value={this.state.lastName}
                  placeholder="Enter text"
                  onChange={this.handleChangeLastName}
                />
                { errorLastName &&
                  <span className={s.warning}>
                    <i className="fa fa-times fa-1" aria-hidden="true"></i>
                    {errorMessage}
                  </span>
                }
              </Col>
            </li>
            <li>
              <Col sm={2} className={s.profileLeft}>
                <i className="fa fa-envelope-o fa-2x" aria-hidden="true"></i>
                <span>Tên</span>
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  value={this.state.firstName}
                  placeholder="Enter text"
                  onChange={this.handleChangeFirstName}
                />
                { errorFirstname &&
                  <span className={s.warning}>
                    <i className="fa fa-times fa-1" aria-hidden="true"></i>
                    {errorMessage}
                  </span>
                }
              </Col>
            </li>
            <li>
              <Col sm={2} className={s.profileLeft}>
                <i className="fa fa-venus-mars fa-2x" aria-hidden="true"></i>
                <span>Giới tính</span>
              </Col>
              <Col sm={10} style={{ paddingTop: '5px' }}>
                <FormGroup>
                  <Radio value={MALE} name="radioGroup" inline>
                    Nam
                  </Radio>
                  {' '}
                  <Radio value={FEMALE} name="radioGroup" inline>
                    Nữ
                  </Radio>
                </FormGroup>
              </Col>
            </li>
            <li>
              <Col sm={2}></Col>
              <Col sm={10}>
                {/* <Button
                  bsSize="large"
                  className={s.buttonAccept}
                  onClick={this.openInfoUpdate}
                  disabled={errorFirstname || errorLastName}
                >
                  Xem lại thay đổi
                </Button> */}
                <Button
                  bsStyle="primary" bsSize="large"
                  className={s.buttonAccept}
                  onClick={this.openInfoUpdate}
                  disabled={errorFirstname || errorLastName}
                >
                  Xem lại thay đổi
                </Button>
                <Button className={s.buttonCancel}>
                  Hủy
                </Button>
              </Col>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

InfoTab.propTypes = {};

InfoTab.propTypes = {
  userId: PropTypes.string,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  client: PropTypes.object.isRequired,
  queryData: PropTypes.object.isRequired,
  paramData: PropTypes.object.isRequired,
};

InfoTab.defaultProps = {
  profile: {
    firstName: '',
    lastName: '',
    gender: '',
  },
};

export default withStyles(s)(withApollo(InfoTab));

