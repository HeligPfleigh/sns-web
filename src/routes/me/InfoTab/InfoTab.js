import React, { Component } from 'react';
import classNames from 'classnames';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import UpdateProfile from './UpdateProfile';
import ChangePassword from './ChangePassword';
import s from './InfoTab.scss';

class InfoTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPassUpdate: false,
      isInfoUpdate: false,
    };
  }

  updateView = () => {
    this.setState({
      isInfoUpdate: !this.state.isInfoUpdate,
    });
  }

  changeViewMode = () => {
    this.setState({
      isPassUpdate: !this.state.isPassUpdate,
    });
  }

  render() {
    const { isInfoUpdate, isPassUpdate } = this.state;

    return (
      <div className={classNames(s.container)}>
        {
          !isPassUpdate &&
          <UpdateProfile isInfoUpdate={isInfoUpdate} updateView={this.updateView} />
        }

        {
          isPassUpdate && <ChangePassword updateView={this.changeViewMode} />
        }
        <Grid className={s.btnGroup}>
          <Row>
            {
              !isInfoUpdate && !isPassUpdate &&
              <Col smOffset={1} sm={11}>
                <Button className={s.buttonAccept} onClick={this.updateView}>
                  <i className="fa fa-cogs" aria-hidden="true"></i>
                  Đổi thông tin
                </Button>
                <Button className={s.buttonAccept} onClick={this.changeViewMode}>
                  <i className="fa fa-lock" aria-hidden="true"></i>
                  Đổi mật khẩu
                </Button>
              </Col>
            }
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withStyles(s)(InfoTab);
