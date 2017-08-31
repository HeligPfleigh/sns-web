import React, { PropTypes } from 'react';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Col,
  FormGroup,
  InputGroup,
  FormControl,
 } from 'react-bootstrap';

import PreviewUploadFile from '../PreviewUploadFile/PreviewUploadFile';
import config from '../../../config';
import s from './UploadFeeFile.scss';

class UploadFeeFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: new Date(),
      showPreviewModal: false,
      typeFeeModal: {},
      feeFiles: [],
      fileShowModal: {},
      resultForPreview: {},
      fileSelected: {},
    };
  }

  onModalClose = () => {
    this.setState({
      showPreviewModal: false,
    });
  }

  onFilePicked = (type, input) => {
    if (input.target.files.length > 0) {
      this.setState({
        showPreviewModal: true,
        typeFeeModal: type,
        fileShowModal: input.target.files[0],
      });
      this.validateFeeFile(input.target.files[0]);
    }
  }

  onFileSelected = feeType => (event) => {
    event.preventDefault();
    const { fileSelected } = this.state;
    fileSelected[feeType] = event.target.checked;
    this.setState({ fileSelected });
  }

  hasFileSelected = feeType => this.state.fileSelected.hasOwnProperty(feeType) && this.state.fileSelected[feeType] === true;

  onUploadCancel = (feeType) => {
    const { fileSelected } = this.state;
    fileSelected[feeType] = false;
    this.setState({ fileSelected });
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  validateFeeFile = async (file) => {
    const url = `${config.server.documentUpload}?building=${this.props.buildingId}`;
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
      const result = await response.json();
      this.setState({
        resultForPreview: result,
      });
    } catch (e) {
      throw e;
    }
  }

  render() {
    const { feeTypes, buildingId } = this.props;
    const { showPreviewModal, fileShowModal, typeFeeModal, resultForPreview } = this.state;
    return (
      <div className={s.container}>
        <PreviewUploadFile
          show={showPreviewModal}
          closeModal={this.onModalClose}
          type={typeFeeModal}
          feeFile={fileShowModal}
          data={resultForPreview}
          buildingId={buildingId}
          onCancel={this.onUploadCancel}
        />
        <Col xs={12} className={s.contentMain}>
          <Col xs={12} className={s.title}>
            <i className="fa fa-money" aria-hidden="true"></i>
            <h4>Biểu phí</h4>
            <a href="http://api-sns.mttjsc.com/images/template_fee.xlsx" className={s.downloadFile}>
              <i className="fa fa-download" aria-hidden="true"> Tập tin mẫu</i>
            </a>
          </Col>
          <Col xs={12} className={s.list}>
            {
              (feeTypes || []).map(type => (<Col xs={12} key={Math.random()} className={s.file}>
                <Col xs={3}>{type.name}</Col>
                <Col xs={9}>
                  <FormGroup>
                    <InputGroup>
                      <FormControl
                        type="file"
                        disabled={!this.hasFileSelected(type.code)}
                        onChange={(input) => {
                          this.onFilePicked(type, input);
                        }}
                        className="form-control"
                      />
                      <InputGroup.Addon>
                        <input type="checkbox" onChange={this.onFileSelected(type.code)} className={s.inputCheckbox} checked={this.hasFileSelected(type.code)} />
                      </InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Col>))
            }
          </Col>
        </Col>
      </div>
    );
  }
}

UploadFeeFile.propTypes = {
  feeTypes: PropTypes.array.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
)(UploadFeeFile);
