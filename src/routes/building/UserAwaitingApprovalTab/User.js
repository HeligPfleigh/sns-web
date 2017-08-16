import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Modal, Button, Grid, Row, Col, Clearfix } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as _ from 'lodash';

import s from './UserAwaitingApproval.scss';

class User extends Component {
  /**
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  /**
   * 
   */
  onCancel(event) {
    this.setState({
      isLoading: true,
    });
    return this.props.onAccept(this.props.data)
      .call(this, event)
      .then(() => this.onCloseModal())
      .catch(() => this.onCloseModal());  
  }

  /**
   * 
   */
  onAccept(event) {
    this.setState({
      isLoading: true,
    });
    return this.props.onAccept(this.props.data)
      .call(this, event)
      .then(() => this.onCloseModal())
      .catch(() => this.onCloseModal());  
  }

  /**
   * 
   */
  onCloseModal() {
    this.setState({
      isLoading: false,
    });
    this.props.closeModal();
  }

  /**
   * 
   */
  render() {
    return (
      <Modal show={ this.props.show } onHide={ this.onCloseModal.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thành viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid className={ s.userDetailAwaitingApproval } fluid>
            { this.props.data.profile && (
            <div>
              <Row className={ s.item }>              
                <Col sm={4} md={2} className={ s.label }><i className="fa fa-user-o" /> Họ và tên:</Col>
                <Col sm={8} md={10}>{ this.props.data.profile.firstName } { this.props.data.profile.lastName }</Col>
                <Clearfix visibleSmBlock/>              
              </Row>

              <Row className={ s.item }>              
                <Col sm={4} md={2} className={ s.label }><i className="fa fa-circle-o" /> Giới tính:</Col>
                <Col sm={8} md={10}>{ this.props.data.profile.gender === 'male' ? 'Nam' : 'Nữ' }</Col>
                <Clearfix visibleSmBlock/>              
              </Row>
            </div>
            ) }

            { this.props.data.phones && this.props.data.phones.number && (
            <Row className={ s.item }>              
              <Col sm={4} md={2} className={ s.label }><i className="fa fa-phone" /> Số điện thoại:</Col>
              <Col sm={8} md={10}>{ this.props.data.phones.number }</Col>
              <Clearfix visibleSmBlock/>              
            </Row>
            ) }

            { this.props.data.emails && this.props.data.emails.address && (
            <Row className={ s.item }>              
              <Col sm={4} md={2} className={ s.label }><i className="fa fa-envelope-open-o" /> Email:</Col>
              <Col sm={8} md={10}>{ this.props.data.emails.address }</Col>
              <Clearfix visibleSmBlock/>              
            </Row>
            ) }

            { this.props.data.apartments && (
            <Row className={ s.item }>              
              <Col sm={4} md={2} className={ s.label }><i className="fa fa-address-book-o" /> Địa chỉ:</Col>
              <Col sm={8} md={10}>{ this.props.data.apartments.map(apartment => <p key={ Math.random() }>Căn hộ số #{ apartment.number }, thuộc tòa nhà { apartment.building.name }</p>) }</Col>
              <Clearfix visibleSmBlock/>              
            </Row>
            ) }
            
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={ this.onCancel.bind(this) } disabled={ this.state.isLoading }><i className="fa fa-remove" /> { this.state.isLoading ? 'Loading...' : 'Từ chối' }</Button>
          <Button bsStyle="primary" onClick={ this.onAccept.bind(this) } disabled={ this.state.isLoading }><i className="fa fa-check" /> { this.state.isLoading ? 'Loading...' : 'Đồng ý' }</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

User.propTypes = {
  show: PropTypes.bool,
  data: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};


User.defaultProps = {
  show: false,
};

export default withStyles(s)(User);

