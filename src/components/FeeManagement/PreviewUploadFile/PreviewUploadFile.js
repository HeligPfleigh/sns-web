import React, { PropTypes } from 'react';
import {
  Button,
  Modal,
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
    const url = `${config.server.documentUpload}?building=${buildingId}&type=${type.code}`;
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

  renderPrevieFees() {
    const { type, data } = this.props;
    let increment = 0;

    const renderError = () => (<div className={s.ErrorText}>
      <h5>Lỗi*:</h5>
      <ul>
        {
              Object.keys(data.error).map(key => (
                <li key={Math.random()}>
                  <p>{`Dòng ${key}`}</p>
                  <ul>
                    {data.error[key].errors.map(err => (
                      <li key={Math.random()}>
                        <p>{err}</p>
                      </li>
                        ))}
                  </ul>
                </li>
              ))
            }
      </ul>
    </div>);

    const renderPreview = () => (<table style={{ width: '100%' }} className={s.table}>
      <thead>
        <tr>
          <th key="aparment">Căn hộ</th>
          <th key="freeType">Loại phí</th>
          <th key="amount">Số tiền</th>
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
                <td key={`freeType${i}`}>{type.name}</td>
                <td key={`amount${i}`}>{`${item.total}`}</td>
                <th key={`status${i}`}>{item.paid ? 'Đã nộp' : 'Chưa nộp'}</th>
              </tr>
            );
          })
        }
      </tbody>
    </table>);

    return (<div className={s.TableWrapper}>{ data.error ? renderError() : renderPreview() }</div>);
  }

  render() {
    const { show, closeModal, type, data } = this.props;
    const disableUploadButton = !!data.error;
    const { error, success } = this.state;
    const showMessage = error || success;

    return (
      <Modal show={show} onHide={closeModal} backdrop="static">
        <Modal.Header>
          <Modal.Title>{`Bạn đang upload file phí ${type.name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showMessage ? this.renderMessage() : this.renderPrevieFees()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onCancel}>{ showMessage ? 'Đóng cửa sổ' : 'Hủy bỏ' }</Button>
          {!showMessage && <Button bsStyle="primary" onClick={this.uploadAndSave} disabled={disableUploadButton}>Đồng ý</Button>}
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
