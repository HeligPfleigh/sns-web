import React from 'react';
import { compose } from 'react-apollo';
import {
  Col,
  Button,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import DateTime from 'react-datetime';

import s from './UploadFeeFile.scss';

class UploadFeeFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: new Date(),
    };
  }

  render() {
    return (
      <div className={s.container}>
        <Col md={12} className={s.contentMain}>
          <div className={s.title}>
            <i className="fa fa-money" aria-hidden="true"></i>
            <h4>Upload biểu phí</h4>
            <a href="http://api-sns.mttjsc.com/images/template_fee.xlsx" className={s.downloadFile}><i className="fa fa-download" aria-hidden="true"> File Mẫu</i></a>
          </div>
          <ul className={s.list}>
            <li>
              <div className={s['box-text']}>Thời gian</div>
              <div className={s['box-right']}>
                <DateTime
                  className={s['input-text']}
                  locale="vi"
                  inputProps={{
                    readOnly: true,
                    placeholder: 'hihi',
                  }}
                  closeOnSelect
                  closeOnTab
                  input
                  defaultValue={this.state.start}
                  onChange={(start) => {
                    console.log(start);
                  }}
                  value={this.state.start}
                  style={{ marginBottom: '5px' }}
                />
              </div>
            </li>
            <li>
              <div className={s['box-text']}>Phí dịch vụ</div>
              <div className={s['box-right']}>
                <div className={s['box-full']}>
                  <div className={s['box-input']}><input type="file" value="Choose File" className="fl-r"></input></div>
                  <label className={s['checkbox-inline']}>
                    <input type="checkbox"></input>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className={s['box-text']}>Phí gửi xe</div>
              <div className={s['box-right']}>
                <div className={s['box-full']}>
                  <div className={s['box-input']}><input type="file" value="Choose File" className="fl-r"></input></div>
                  <label className={s['checkbox-inline']}>
                    <input type="checkbox"></input>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className={s['box-text']}>Phí nước</div>
              <div className={s['box-right']}>
                <div className={s['box-full']}>
                  <div className={s['box-input']}><input type="file" value="Choose File" className="fl-r"></input></div>
                  <label className={s['checkbox-inline']}>
                    <input type="checkbox"></input>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className={s['box-text']}>Phí điện</div>
              <div className={s['box-right']}>
                <div className={s['box-full']}>
                  <div className={s['box-input']}><input type="file" value="Choose File" className="fl-r"></input></div>
                  <label className={s['checkbox-inline']}>
                    <input type="checkbox"></input>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className={s['box-text']}>Phí khác</div>
              <div className={s['box-right']}>
                <div className={s['box-full']}>
                  <div className={s['box-input']}><input type="file" value="Choose File" className="fl-r"></input></div>
                  <label className={s['checkbox-inline']}>
                    <input type="checkbox"></input>
                  </label>
                </div>
              </div>
            </li>
            <li className={s.button}>
              <div className={s['box-right']}>
                <Button
                  style={{ marginRight: 5 }}
                >
                  Hủy
                </Button>
                <Button
                  bsStyle="primary"
                >
                  Upload file
                </Button>
              </div>
            </li>
          </ul>
        </Col>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
)(UploadFeeFile);
