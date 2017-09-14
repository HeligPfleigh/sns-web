import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Panel } from 'react-bootstrap';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Modal from '../../Modal';
import history from '../../../core/history';
import { DraftToHTML } from '../../Editor';
import s from './styles.scss';

class FAQs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataModal: undefined,
      showModal: false,
    };
  }

  viewFAQ = (evt, faq) => {
    if (evt) evt.preventDefault();
    this.setState({
      dataModal: faq,
      showModal: true,
    });
  }

  goFAQsPage = (evt) => {
    if (evt) evt.preventDefault();
    const { buildingId } = this.props;
    history.push(`/building/${buildingId}?tab=FAQ_TAB`);
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      dataModal: undefined,
    });
  }

  render() {
    const { dataModal, showModal } = this.state;
    const { listFAQ, styles } = this.props;

    return (
      <div className={classNames(s.boxContent)} style={styles}>
        <h2 className={classNames(s.title)}>
          Hỏi - đáp <a href="#" className={classNames(s.link)} onClick={this.goFAQsPage}>
            {'Xem thêm >>'}
          </a>
        </h2>
        <ul className={classNames(s.listItem)}>
          {
            (listFAQ || []).map(faq => (
              <li key={Math.random()} title={faq.name}>
                <a href="#" onClick={evt => this.viewFAQ(evt, faq)}>
                  <i className={classNames('fa fa-comment')}></i>
                  <h3>{faq.name}</h3>
                  <p className={classNames(s.time)}>
                    { moment(faq.updatedAt).format('[Vào lúc] HH:mm - [Ngày] LL')}
                  </p>
                </a>
              </li>
            ))
          }
        </ul>
        {
          dataModal && <Modal
            title={<strong>Xem chi tiết</strong>}
            closeButton
            show={showModal}
            onHide={this.closeModal}
            buttons={
              <Button bsStyle="info" onClick={this.closeModal}>Đóng cửa sổ</Button>
            }
          >
            <div className={classNames(s.contentModal)}>
              <h3>
                <i className="fa fa-question-circle" aria-hidden="true"></i>
                {dataModal.name}
              </h3>
              <strong>Trả lời: </strong>
              <Panel>
                <div dangerouslySetInnerHTML={{ __html: DraftToHTML(dataModal.message) }} />
              </Panel>
            </div>
          </Modal>
        }
      </div>
    );
  }
}

FAQs.propTypes = {
  styles: PropTypes.any,
  listFAQ: PropTypes.array.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default withStyles(s)(FAQs);
