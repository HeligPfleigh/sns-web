import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import {
  Alert,
  Panel,
  Tooltip,
  PanelGroup,
  Pagination,
  OverlayTrigger,
  Col,
} from 'react-bootstrap';

import Loading from '../../../components/Loading';
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
      currentPage: 1,
      errorMessage: null,
      onUpdateInitialValues: {},
      onDeleteInitialValues: {},
      hideCreateInitialValues: true,
      faqActivated: undefined,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onError = this.onError.bind(this);
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

  onCollapse = (toggle, faqActivated, event) => {
    event.preventDefault();
    this.setState({
      faqActivated: toggle ? faqActivated : undefined,
    });
  }

  handlePageSelect = (pageNum) => {
    this.setState(prevState => ({
      ...prevState,
      currentPage: pageNum,
    }), () => {
      this.props.onChangePage(this.state.currentPage);
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

    const { faqActivated } = this.state;

    return (
      <PanelGroup accordion defaultActiveKey={faqActivated} >
        { edges.map((row) => {
          const hasSelected = row._id === faqActivated;
          const onCollapse = this.onCollapse.bind(this, !hasSelected);

          return (
            <Panel
              header={<div>{hasSelected ? <i className="fa fa-caret-down" aria-hidden="true"></i> : <i className="fa fa-caret-right" aria-hidden="true"></i>} {row.name} </div>}
              eventKey={row._id}
              key={row._id}
              className="individual"
              onSelect={onCollapse}
            >
              <FAQ
                data={row}
                onUpdate={this.onUpdate}
                onDelete={this.onDelete}
                onError={this.onError}
                canUpdate={isAdmin}
                canDelete={isAdmin}
              />
            </Panel>
          );
        })}
      </PanelGroup>
    );
  }

  render() {
    const {
      data: {
        loading,
        FAQs: FAQList,
      },
      building: {
        isAdmin,
        ...building
      },
      updateFAQ,
      createFAQ,
      deleteFAQ,
    } = this.props;

    const pagination = {
      totalPage: 1,
      currentPage: this.state.currentPage,
    };

    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    // Calc total page
    const limit = (FAQList.pageInfo && FAQList.pageInfo.limit) || 15;
    const countRecord = (FAQList.pageInfo && FAQList.pageInfo.total) || 1;
    if (countRecord <= limit) {
      pagination.totalPage = 1;
    } else {
      pagination.totalPage = Math.ceil(countRecord / limit);
    }

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
        { !loading && FAQList &&
          (pagination.totalPage > 1) &&
          <div className="pull-right">
            <Pagination
              maxButtons={5}
              prev={pagination.totalPage > 5}
              next={pagination.totalPage > 5}
              first={pagination.totalPage > 5}
              last={pagination.totalPage > 5}
              ellipsis={pagination.totalPage > 5}
              items={pagination.totalPage}
              activePage={pagination.currentPage}
              onSelect={this.handlePageSelect}
            />
          </div>
        }
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
        limit: 15,
        building: props.building._id,
      },
    }),
    props: ({ data }) => {
      const onChangePage = page => data.fetchMore({
        query: FAQsListQuery,
        variables: {
          page,
          ...data.variables,
        },
        updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
      });

      return {
        data,
        onChangePage,
      };
    },
  }),
  graphql(createFAQMutation, {
    props: ({ mutate }) => ({
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
        updateQueries: {
          FAQsListQuery: (previousResult, { mutationResult }) => {
            const faq = mutationResult.data.createFAQ;
            return update(previousResult, {
              FAQs: {
                edges: {
                  $unshift: [faq],
                },
              },
            });
          },
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
