import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import history from '../../../core/history';
import s from './styles.scss';

class Documents extends Component {

  goDocumentPage = (evt) => {
    if (evt) evt.preventDefault();
    const { buildingId } = this.props;
    history.push(`/building/${buildingId}?tab=DOCUMENT_TAB`);
  }

  render() {
    const { documents, styles } = this.props;

    return (
      <div className={classNames(s.boxContent)} style={styles}>
        <h2 className={classNames(s.title)}>
          Biểu mẫu<a href="#" className={classNames(s.link)} onClick={this.goDocumentPage}>
            {'Xem thêm >>'}
          </a>
        </h2>
        <ul className={classNames(s.listItem)}>
          {
            (documents || []).map(doc => (
              <li key={Math.random()}>
                <i className={classNames('fa fa-file-pdf-o')}></i>
                <h3>
                  {doc.name} (<a className="text-info" href={doc.file} title={doc.file}>
                    <span className="fa fa-download" aria-hidden="true"></span>
                    Tải xuống
                  </a>)
                </h3>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

Documents.propTypes = {
  styles: PropTypes.any,
  documents: PropTypes.array.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default withStyles(s)(Documents);
