import React, { PropTypes } from 'react';
import {
  Button,
  Modal,
  Table,
  Col,
  ButtonToolbar,
  Panel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import s from './PreviewUploadFile.scss';
import config from '../../../config';

class PreviewUpload extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      message: null,
      success: false,
      error: false,
    };
  }

  onCancel = () => {
    this.setState({
      success: false,
      error: false,
      message: null,
    });
    this.props.onCancel(this.props.type.code);
    this.props.closeModal();
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  uploadAndSave = async () => {
    const { type, buildingId, feeFile } = this.props;
    const url = `${config.server.documentUpload}?building=${buildingId}&type=${type.code}&import`;
    const token = this.getCookie('id_token');
    const formData = new FormData();
    formData.append('file', feeFile);
    try {
      const response = await fetch(url, {
        headers: new Headers({
          authorization: token,
        }),
        method: 'post',
        body: formData,
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }
      this.setState({
        message: 'Bạn đã cập nhật thành công.',
        success: true,
        error: false,
      });
    } catch (e) {
      this.setState({
        message: 'Có lỗi trong quá trình cập nhật.',
        success: false,
        error: true,
      });
      throw e;
    }
  }

  renderMessage() {
    const { message, error, success } = this.state;
    return <p className={classNames('text-center', { 'text-success': success, 'text-danger': error })}>{message}</p>;
  }

  renderPrevieFees(hasError) {
    const { data } = this.props;
    let increment = 0;

    const renderError = () => (<Panel className={s.ErrorText}>
      <h5>{data.message}</h5>
      {data.validationErrors && (<ListGroup>
          {Object.keys(data.validationErrors).map(key => (<ListGroupItem key={Math.random()}>
            <div><i className="fa fa-circle-o" aria-hidden="true"></i> {`Dòng ${key}`}</div>
            <ListGroup>
              {data.validationErrors[key].map(err => (<ListGroupItem key={Math.random()}><i className="fa fa-caret-right" aria-hidden="true"></i> {err}</ListGroupItem>))}
            </ListGroup>
          </ListGroupItem>))}
        </ListGroup>)}
    </Panel>);

    const renderPreview = () => (<Table>
      <thead>
        <tr>
          <th key="aparment">Căn hộ</th>
          <th key="freeType">Loại phí</th>
          <th key="amount">Số tiền</th>
          <th key="datetime">Thời gian</th>
          <th key="status">Đã thanh toán</th>
        </tr>
      </thead>
      <tbody>
        {
          data.data && data.data.map((item) => {
            const i = ++increment;
            return (
              <tr key={`k${i}`}>
                <td key={`aparment${i}`}>{item.apartment_number}</td>
                <td key={`freeType${i}`}>{item.fee}</td>
                <td key={`amount${i}`}>{`${item.total}`}</td>
                <td key={`datetime${i}`}>{`${item.time.month}/${item.time.year}`}</td>
                <td key={`status${i}`}>{item.paid ? <span className="text-success">Đã nộp</span> : <span className="text-danger">Chưa nộp</span>}</td>
              </tr>
            );
          })
        }
      </tbody>
    </Table>);

    return (<div className={s.TableWrapper}>{ hasError ? renderError() : renderPreview() }</div>);
  }

  render() {
    const { show, closeModal, type, data } = this.props;
    const hasError = !!data.error;
    const { error, success } = this.state;
    const showMessage = error || success;
    return (
      <Modal show={show} onHide={closeModal} backdrop="static" className={s.previewFees}>
        <Modal.Header>
          <Modal.Title>{`Bạn đang tải tập lên tập tin ${type.name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showMessage ? this.renderMessage() : this.renderPrevieFees(hasError)}
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            <ButtonToolbar>
              <Button type="button" onClick={this.onCancel}>{ showMessage ? 'Đóng cửa sổ' : 'Hủy bỏ' }</Button>
              {!showMessage && <Button type="button" bsStyle="primary" onClick={this.uploadAndSave} disabled={hasError}>Đồng ý</Button>}
            </ButtonToolbar>
          </div>
          <Col className={s.note}>(*Ghi chú: Nếu tập tin tải lên không đúng, bạn có thể hủy và chọn lại.)</Col>
        </Modal.Footer>
      </Modal>
    );
  }
}

PreviewUpload.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  type: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default withStyles(s)(PreviewUpload);
