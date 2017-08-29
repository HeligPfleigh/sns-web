import React, { PropTypes } from 'react';
import { compose } from 'react-apollo';
import { Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
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
      uploadCompletes: {},
    };
  }

  onModalClose = () => {
    this.setState({
      showPreviewModal: false,
    });
  }

  onUploadComplete = (type) => {
    const uploadCompletes = this.state.uploadCompletes;
    uploadCompletes[type.toString()] = true;
    this.setState({
      showPreviewModal: false,
      uploadCompletes,
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

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  validateFeeFile = async (file) => {
    console.log(file);
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
    const { showPreviewModal, fileShowModal, typeFeeModal, resultForPreview, uploadCompletes } = this.state;
    return (
      <div className={s.container}>
        <PreviewUploadFile
          show={showPreviewModal}
          closeModal={this.onModalClose}
          type={typeFeeModal}
          feeFile={fileShowModal}
          data={resultForPreview}
          buildingId={buildingId}
          onUploadComplete={this.onUploadComplete}
        />
        <Col md={12} className={s.contentMain}>
          <div className={s.title}>
            <i className="fa fa-money" aria-hidden="true"></i>
            <h4>Upload biểu phí</h4>
            <a href="http://api-sns.mttjsc.com/images/template_fee.xlsx" className={s.downloadFile}>
              <i className="fa fa-download" aria-hidden="true"> File Mẫu</i>
            </a>
          </div>
          <ul className={s.list}>
            {
              (feeTypes || []).map(type => (<li>
                <div className={s['box-text']}>{type.name}</div>
                <div className={s['box-right']}>
                  <div className={s['box-full']}>
                    <div className={s['box-input']}>
                      <input
                        type="file"
                        onChange={(input) => {
                          this.onFilePicked(type, input);
                        }}
                      />
                    </div>
                    <label className={s['checkbox-inline']}>
                      <input type="checkbox" checked={uploadCompletes[type.code.toString()]} disabled></input>
                    </label>
                  </div>
                </div>
              </li>))
            }
          </ul>
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
