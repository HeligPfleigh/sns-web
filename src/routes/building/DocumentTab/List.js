import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { Alert, Panel, ListGroup, Tooltip, OverlayTrigger, Col } from 'react-bootstrap';
import isObject from 'lodash/isObject';

import Pagination from '../../../components/Pagination';

import documentsListQuery from './documentsListQuery.graphql';
import createDocumentMutation from './createDocumentMutation.graphql';
import updateDocumentMutation from './updateDocumentMutation.graphql';
import deleteDocumentMutation from './deleteDocumentMutation.graphql';

import Document from './Document';
import UpdateModal from './Update';
import CreateModal from './Create';
import DeleteModal from './Delete';
import s from './Document.scss';

const tooltip = message => (<Tooltip id={Math.random()}>{message}</Tooltip>);
class Documents extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      errorMessage: null,
      onUpdateInitialValues: {},
      onDeleteInitialValues: {},
      hideCreateInitialValues: true,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onError = this.onError.bind(this);
    this.onHideUpdateDocumentModal = this.onHideUpdateDocumentModal.bind(this);
    this.onHideDeleteDocumentModal = this.onHideDeleteDocumentModal.bind(this);
    this.onHideCreateleteDocumentModal = this.onHideCreateleteDocumentModal.bind(this);
  }

  onHideCreateleteDocumentModal(hideCreateInitialValues) {
    this.setState({
      hideCreateInitialValues,
    });
  }

  onHideUpdateDocumentModal(onUpdateInitialValues = {}) {
    this.setState({
      onUpdateInitialValues,
    });
  }

  onHideDeleteDocumentModal(onDeleteInitialValues = {}) {
    this.setState({
      onDeleteInitialValues,
    });
  }

  onCreate() {
    this.onHideCreateleteDocumentModal();
  }

  onUpdate(documentData) {
    if (!isObject(documentData)) {
      return;
    }

    this.onHideUpdateDocumentModal(documentData);
  }

  onDelete(documentData) {
    if (!isObject(documentData)) {
      return;
    }

    this.onHideDeleteDocumentModal(documentData);
  }

  onError(errorMessage) {
    this.setState({
      errorMessage,
    });
  }

  renderLoadingIcon = () => (
    <div className={classNames(s.noRecordsFound, 'text-center')}>
      <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Đang tải dữ liệu ...
    </div>
  )

  renderNoRecordsFound = () => (
    <div className={classNames(s.noRecordsFound, 'text-center')}>
      Hiện tại chưa có biểu mẫu
    </div>
  )

  renderDocuments = () => {
    const {
      data: {
        documents: {
          edges,
        },
      },
      building: {
        isAdmin,
      },
    } = this.props;

    if (edges.length === 0) {
      return this.renderNoRecordsFound();
    }

    return (
      <ListGroup>
        { edges.map(row => (
          <Document
            data={row}
            onUpdate={this.onUpdate}
            onDelete={this.onDelete}
            onError={this.onError}
            canUpdate={isAdmin}
            canDelete={isAdmin}
            key={Math.random()}
          />
        ))}
      </ListGroup>
    );
  }

  render() {
    const {
      data: {
        loading,
        documents,
      },
      building: {
        isAdmin,
        ...building
      },
      updateDocument,
      createDocument,
      deleteDocument,
      onChangePage,
     } = this.props;
    return (
      <Col>
        <Panel
          header={
            <div className={s.panelHeaderTitle}><i className="fa fa-file-pdf-o" aria-hidden="true"></i> Biểu mẫu
            {isAdmin && <OverlayTrigger overlay={tooltip('Thêm mới biểu mẫu')} placement="left">
              <span className={s.panelHeaderAddIcon}><i className="fa fa-plus" aria-hidden="true" onClick={() => this.onHideCreateleteDocumentModal(false)}></i></span>
            </OverlayTrigger>}
            </div>
            } className={s.list}
        >
          {this.state.errorMessage && (<Alert bsStyle="danger" onDismiss={() => this.setState({ errorMessage: false })}>
            { this.state.errorMessage }
          </Alert>)}
          <CreateModal
            onCreate={createDocument}
            onError={this.onError}
            canCreate={isAdmin}
            show={!this.state.hideCreateInitialValues}
            building={building}
            onHide={this.onHideCreateleteDocumentModal}
          />
          <UpdateModal
            onUpdate={updateDocument}
            onDelete={deleteDocument}
            onError={this.onError}
            canUpdate={isAdmin}
            canDelete={isAdmin}
            initialValues={this.state.onUpdateInitialValues}
            building={building}
            onHide={this.onHideUpdateDocumentModal}
          />
          <DeleteModal
            onUpdate={updateDocument}
            onDelete={deleteDocument}
            onError={this.onError}
            canUpdate={isAdmin}
            canDelete={isAdmin}
            initialValues={this.state.onDeleteInitialValues}
            building={building}
            onHide={this.onHideDeleteDocumentModal}
          />
          { loading ? this.renderLoadingIcon() : this.renderDocuments() }
        </Panel>
        { !loading && documents && <Pagination
          total={documents.pageInfo.total}
          page={documents.pageInfo.page}
          limit={documents.pageInfo.limit}
          onChange={onChangePage}
          className="pull-right"
        /> }
      </Col>
    );
  }
}

Documents.propTypes = {
  building: PropTypes.shape({
    _id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  data: PropTypes.shape({
    documents: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  onChangePage: PropTypes.func.isRequired,
  createDocument: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(documentsListQuery, {
    options: props => ({
      variables: {
        building: props.building._id,
      },
    }),
    props: ({ ownProps, data }) => {
      const onChangePage = page => data.fetchMore({
        query: documentsListQuery,
        variables: {
          building: ownProps.building._id,
          page,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => ({
          ...fetchMoreResult,
        }),
      });

      return {
        data,
        onChangePage,
      };
    },
  }),
  graphql(createDocumentMutation, {
    props: ({ ownProps, mutate }) => ({
      createDocument: input => mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createDocument: {
            __typename: 'Document',
            _id: `DocumentId${Math.random()}`,
            name: null,
            file: null,
            building: {
              __typename: 'Building',
              _id: null,
              name: null,
              display: null,
              isAdmin: true,
            },
          },
        },
        update: (store, { data: { createDocument } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: documentsListQuery,
            variables: {
              building: ownProps.building._id,
            },
          });
          data = update(data, {
            documents: {
              edges: {
                $unshift: [createDocument],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: documentsListQuery,
            variables: {
              building: ownProps.building._id,
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(updateDocumentMutation, {
    props: ({ mutate }) => ({
      updateDocument: input => mutate({
        variables: {
          input,
        },
      }),
    }),
  }),
  graphql(deleteDocumentMutation, {
    props: ({ mutate }) => ({
      deleteDocument: input => mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteDocument: {
            __typename: 'Document',
            _id: null,
          },
        },
        updateQueries: {
          documentsListQuery: (previousResult, { mutationResult }) => {
            const document = mutationResult.data.deleteDocument;
            return update(previousResult, {
              documents: {
                edges: {
                  $unset: [document._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(Documents);
