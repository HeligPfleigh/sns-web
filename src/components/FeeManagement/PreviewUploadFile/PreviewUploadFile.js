import React, { PropTypes } from 'react';
import {
  Col,
  Button,
  Modal,
} from 'react-bootstrap';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PreviewUploadFile.scss';
import config from '../../../config';


class PreviewUpload extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      uploadComplete: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      uploadComplete: false,
    });
  }

  onSubmit = () => {
    this.uploadAndSave();
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  uploadAndSave = async () => {
    const file = this.props.feeFile;
    const url = `${config.server.documentUpload}?building=${this.props.buildingId}&type=${this.props.type.code}`;
    const token = this.getCookie('id_token');
    const formData = new FormData();
    formData.append('file', file);
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
      await response.json();
      this.props.onUploadComplete(this.props.type.code);
      this.setState({
        uploadComplete: true,
      });
    } catch (e) {
      throw e;
    }
  }


  render() {
    const { show, closeModal, type, data } = this.props;
    const disableUploadButton = !!data.error;

    return (
      <Modal show={show} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>{`Bạn đang upload file phí ${type.name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={s.TableWrapper}>
            {
              data.error && <div className={s.ErrorText}>
                <h5>Lỗi*:</h5>
                <ul>
                  {
                    Object.keys(data.error).map((key, idx) => (

                      <li>
                        <p>{`Dòng ${key}`}</p>
                        <ul>
                          {data.error[key].errors.map(err => (
                            <li>
                              <p>{err}</p>
                            </li>
                              ))}
                        </ul>
                      </li>
                      ))
                  }
                </ul>
              </div>
            }
            {
              !data.error ? <div>
                <table style={{ width: '100%' }} className={s.table}>
                  <tr>
                    <th>Căn hộ</th>
                    <th>Loại phí</th>
                    <th>Số tiền</th>
                    <th>Đã thanh toán</th>
                  </tr>
                  {
                    data.data && data.data.map(item => (
                      <tr>
                        <td>{item.apartment_number}</td>
                        <td>{type.name}</td>
                        <td>{`${item.total}`}</td>
                        <th>{item.paid ? 'Đã nộp' : 'Chưa nộp'}</th>
                      </tr>
                    ))
                  }
                </table>
              </div> : null
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Hủy bỏ</Button>
          <Button
            bsStyle="primary"
            onClick={this.onSubmit}
            disabled={disableUploadButton}
          >
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PreviewUpload.propTypes = {
  buildingId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.object.isRequired,
  feeFile: PropTypes.object,
  data: PropTypes.object,
  onUploadComplete: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
)(PreviewUpload);
