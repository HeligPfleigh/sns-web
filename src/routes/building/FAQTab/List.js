import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import { Alert, Panel, Tooltip, OverlayTrigger, Accordion, Col } from 'react-bootstrap';
import isObject from 'lodash/isObject';

import Pagination from '../../../components/Pagination';

import FAQsListQuery from './FAQsListQuery.graphql';
import createFAQMutation from './createFAQMutation.graphql';
import updateFAQMutation from './updateFAQMutation.graphql';
import deleteFAQMutation from './deleteFAQMutation.graphql';

import FAQ from './FAQ';
import UpdateModal from './Update';
import CreateModal from './Create';
import DeleteModal from './Delete';
import s from './FAQ.scss';

const tooltip = message => (<Tooltip id={Math.random()}>{message}</Tooltip>);
class FAQs extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      errorMessage: null,
      onUpdateInitialValues: {},
      onDeleteInitialValues: {},
      hideCreateInitialValues: true,
      showFAQ: '',
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onError = this.onError.bind(this);
    this.onFAQSelected = this.onFAQSelected.bind(this);
    this.onHideUpdateFAQModal = this.onHideUpdateFAQModal.bind(this);
    this.onHideDeleteFAQModal = this.onHideDeleteFAQModal.bind(this);
    this.onHideCreateleteFAQModal = this.onHideCreateleteFAQModal.bind(this);
  }

  onHideCreateleteFAQModal(hideCreateInitialValues) {
    this.setState({
      hideCreateInitialValues,
    });
  }

  onHideUpdateFAQModal(onUpdateInitialValues = {}) {
    this.setState({
      onUpdateInitialValues,
    });
  }

  onHideDeleteFAQModal(onDeleteInitialValues = {}) {
    this.setState({
      onDeleteInitialValues,
    });
  }

  onFAQSelected(FAQSelected) {
    this.setState({
      FAQSelected,
    });
  }

  onCreate() {
    this.onHideCreateleteFAQModal();
  }

  onUpdate(FAQData) {
    if (!isObject(FAQData)) {
      return;
    }

    this.onHideUpdateFAQModal(FAQData);
  }

  onDelete(FAQData) {
    if (!isObject(FAQData)) {
      return;
    }

    this.onHideDeleteFAQModal(FAQData);
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
      Hiện tại chưa có dữ liệu
    </div>
  )

  renderFAQs = () => {
    const {
      data: {
        FAQs: {
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
      <Accordion>
        { edges.map(row => (
          <Panel
            header={<div><i className="fa fa-caret-right" aria-hidden="true"></i> {row.name} </div>}
            eventKey={row._id}
            key={row._id}
            className={classNames({ individual: true })}
            onSelect={this.onFAQSelected}
          >
            <FAQ
              data={row}
              onUpdate={this.onUpdate}
              onDelete={this.onDelete}
              onError={this.onError}
              canUpdate={isAdmin}
              canDelete={isAdmin}
              selected={row._id === this.state.FAQSelected}
            />
          </Panel>
        ))}
      </Accordion>
    );
  }

  render() {
    const {
      data: {
        loading,
        FAQs,
      },
      building: {
        isAdmin,
        ...building
      },
      updateFAQ,
      createFAQ,
      deleteFAQ,
      onChangePage,
     } = this.props;
    return (
      <Col>
        <Panel
          header={
            <div className={s.panelHeaderTitle}>
              <i className="fa fa-question-circle" aria-hidden="true"></i> Câu hỏi thường gặp
            {isAdmin && <OverlayTrigger overlay={tooltip('Thêm mới câu hỏi thường gặp')} placement="left">
              <span className={s.panelHeaderAddIcon}>
                <i className="fa fa-plus" aria-hidden="true" onClick={() => this.onHideCreateleteFAQModal(false)}></i>
              </span>
            </OverlayTrigger>
            }
            </div>
        }
          className={s.list}
        >
          {this.state.errorMessage && (<Alert bsStyle="danger" onDismiss={() => this.setState({ errorMessage: false })}>
            { this.state.errorMessage }
          </Alert>)}
          <CreateModal
            onCreate={createFAQ}
            onError={this.onError}
            canCreate={isAdmin}
            show={!this.state.hideCreateInitialValues}
            building={building}
            onHide={this.onHideCreateleteFAQModal}
          />
          <UpdateModal
            onUpdate={updateFAQ}
            onDelete={deleteFAQ}
            onError={this.onError}
            canUpdate={isAdmin}
            canDelete={isAdmin}
            initialValues={this.state.onUpdateInitialValues}
            building={building}
            onHide={this.onHideUpdateFAQModal}
          />
          <DeleteModal
            onUpdate={updateFAQ}
            onDelete={deleteFAQ}
            onError={this.onError}
            canUpdate={isAdmin}
            canDelete={isAdmin}
            initialValues={this.state.onDeleteInitialValues}
            building={building}
            onHide={this.onHideDeleteFAQModal}
          />
          { loading ? this.renderLoadingIcon() : this.renderFAQs() }
        </Panel>
        { !loading && FAQs && <Pagination total={FAQs.pageInfo.total} page={FAQs.pageInfo.page} limit={FAQs.pageInfo.limit} onChange={onChangePage} className="pull-right" /> }
      </Col>
    );
  }
}

FAQs.propTypes = {
  building: PropTypes.shape({
    _id: PropTypes.string,
    isAdmin: PropTypes.bool,
  }).isRequired,
  data: PropTypes.shape({
    FAQs: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  onChangePage: PropTypes.func.isRequired,
  createFAQ: PropTypes.func.isRequired,
  updateFAQ: PropTypes.func.isRequired,
  deleteFAQ: PropTypes.func.isRequired,
};

export default compose(
  withStyles(s),
  graphql(FAQsListQuery, {
    options: props => ({
      variables: {
        building: props.building._id,
      },
    }),
    props: ({ ownProps, data }) => {
      const onChangePage = page => data.fetchMore({
        query: FAQsListQuery,
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
  graphql(createFAQMutation, {
    props: ({ ownProps, mutate }) => ({
      createFAQ: input => mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createFAQ: {
            __typename: 'FAQ',
            _id: `FAQId${Math.random()}`,
            name: null,
            message: null,
            building: {
              __typename: 'Building',
              _id: null,
              name: null,
              display: null,
              isAdmin: true,
            },
          },
        },
        update: (store, { data: { createFAQ } }) => {
          // Read the data from our cache for this query.
          let data = store.readQuery({
            query: FAQsListQuery,
            variables: {
              building: ownProps.building._id,
            },
          });
          data = update(data, {
            FAQs: {
              edges: {
                $unshift: [createFAQ],
              },
            },
          });
          // Write our data back to the cache.
          store.writeQuery({
            query: FAQsListQuery,
            variables: {
              building: ownProps.building._id,
            },
            data,
          });
        },
      }),
    }),
  }),
  graphql(updateFAQMutation, {
    props: ({ mutate }) => ({
      updateFAQ: input => mutate({
        variables: {
          input,
        },
      }),
    }),
  }),
  graphql(deleteFAQMutation, {
    props: ({ mutate }) => ({
      deleteFAQ: input => mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteFAQ: {
            __typename: 'FAQ',
            _id: null,
          },
        },
        updateQueries: {
          FAQsListQuery: (previousResult, { mutationResult }) => {
            const faq = mutationResult.data.deleteFAQ;
            return update(previousResult, {
              FAQs: {
                edges: {
                  $unset: [faq._id],
                },
              },
            });
          },
        },
      }),
    }),
  }),
)(FAQs);
