import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Clearfix, ControlLabel, Button, FormGroup, ButtonGroup, Alert } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import isString from 'lodash/isString';
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import update from 'immutability-helper';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import Table from 'rc-table';
import Loading from '../../../components/Loading';
import DownloadFile from '../../../components/Common/DownloadFile';
import Pagination from '../../../components/Pagination';
import Validator from '../../../components/Validator';
import history from '../../../core/history';
import InputField from './InputField';
import ResidentsInBuildingGroupByApartmentQuery from './ResidentsInBuildingGroupByApartmentQuery.graphql';
import DeleteResidentInBuildingMutation from './DeleteResidentInBuildingMutation.graphql';
import ExportResidentsInBuildingGroupByApartmentMutation from './ExportResidentsInBuildingGroupByApartmentMutation.graphql';
import DeleteResidentModal from './DeleteResident';
import Menu from '../Menu/Menu';
import s from './GroundManagement.scss';

class GroundManagement extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      deleteResidentValues: {},
      errorMessage: null,
    };

    this.hasSubmitFiltering = false;
    this.prevValues = {};
  }

  onChangePage = page => this.props.onChangePage({
    page,
    filters: this.getAllFilterInputs(),
  })

  onSubmitFilter = () => {
    this.hasFilterSubmitted = true;
    const { initialize, currentValues } = this.props;
    this.prevValues = currentValues;
    return this.onChangePage(1).then(() => {
      initialize(currentValues);
    });
  }

  onDeleteResident = ({ resident, apartment, building }) => this.props.onDeleteResident({
    resident,
    apartment,
    building,
  })

  onHideDeleteResidentModal = () => {
    this.setState({
      deleteResidentValues: {},
    });
  }

  onErrorWhenDeleteResident = (errorMessage) => {
    this.setState({
      errorMessage,
    });
  }

  onExportToExcel = building => async (event) => {
    event.preventDefault();

    try {
      const r = await this.props.onExportToExcel({
        building,
        filters: this.getAllFilterInputs(),
      });

      const { data: { exportResidentsInBuildingGroupByApartment: { file } } } = r;
      if (isUndefined(file) || isNull(file)) {
        this.onErrorWhenDeleteResident('Không thể tạo được đường dẫn để tạo tập tin.');
        return;
      }

      DownloadFile(file);
    } catch (e) {
      this.onErrorWhenDeleteResident('Có lỗi trong quá trình tải tập tin.');
    }
  }

  getAllFilterInputs() {
    if (!this.hasFilterSubmitted) {
      return {};
    }

    const { filterByApartment, filterByResident } = this.prevValues;
    return {
      apartment: isString(filterByApartment) ? String(filterByApartment).trim() : '',
      resident: isString(filterByResident) ? String(filterByResident).trim() : '',
    };
  }

  viewActions = rows => rows.expanded ? this.viewApartment(rows) : this.viewResident(rows)

  viewResident = data => (<Col className="text-center">
    <ButtonGroup>
      <Button
        type="button"
        onClick={(evt) => {
          evt.preventDefault();
          history.push(`/user/${data._id}?tab=MY_INFO`);
        }}
        title="Xem thông tin của cư dân"
        className="btn btn-sm btn-info"
      ><i className="fa fa-info-circle" /></Button>
      <Button
        type="button"
        onClick={(evt) => {
          evt.preventDefault();
          this.setState({
            deleteResidentValues: {
              resident: data._id,
              apartment: data.apartment,
              building: data.building,
            },
          });
        }}
        title="Loại bỏ cư dân này ra khỏi căn hộ này"
        className="btn btn-sm btn-danger"
      >Xóa</Button>
    </ButtonGroup>
  </Col>);

  viewApartment = () => (
    <a
      href="#"
      onClick={(evt) => {
        evt.preventDefault();
      }}
    >{'Thông tin căn hộ >>'}</a>
    );

  tableColumns = () => [{
    title: 'Căn hộ', dataIndex: 'apartmentName', key: 'apartmentName', className: 'apartmentName',
  }, {
    title: 'Cư dân', dataIndex: 'residentName', key: 'residentName', className: 'residentName',
  }, {
    title: 'Vai trò', dataIndex: 'residentRole', key: 'residentRole', className: 'residentRole',
  }, {
    title: `${' '}`, dataIndex: '', key: 'actions', className: 'actions', render: this.viewActions,
  }];

  datatable() {
    const {
      data: {
        residentsInBuildingGroupByApartment,
      },
    } = this.props;

    const data = [];
    if (isObject(residentsInBuildingGroupByApartment) && Array.isArray(residentsInBuildingGroupByApartment.edges)) {
      residentsInBuildingGroupByApartment.edges.forEach((rows) => {
        const children = [];
        if (Array.isArray(rows.residents)) {
          rows.residents.forEach((resident) => {
            children.push({
              _id: resident._id,
              apartment: rows._id,
              building: rows.building,
              rowKey: `${rows._id}-${resident._id}`,
              residentName: (isObject(resident.profile) && resident.profile.fullName) || resident.name,
              residentRole: resident._id === rows.owner ? 'Chủ hộ' : 'Người thuê nhà',
              expanded: false,
            });
          });
        }

        data.push({
          _id: rows._id,
          rowKey: rows._id,
          apartmentName: rows.name,
          residentName: `Có tổng số ${children.length} cư dân`,
          expanded: true,
          children,
        });
      });
    }

    return (<Table
      rowKey="rowKey"
      data={data}
      expandIconAsCell
      expandRowByClick
      columns={this.tableColumns()}
      emptyText="Hiện tại không có dữ liệu."
      className={s.datatable}
    />);
  }

  render() {
    const {
      buildingId,
      user,
      data: {
        loading,
        residentsInBuildingGroupByApartment,
      },
      handleSubmit,
      pristine,
      submitting,
      invalid,
      form,
      currentValues,
     } = this.props;

     // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    return (
      <Grid>
        <Row className={s.containerTop30}>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={3} smHidden xsHidden>
              <Menu parentPath={`/management/${buildingId}`} pageKey="ground_management" user={user} />
            </Col>
          </MediaQuery>
          <Col md={9} sm={12} xs={12}>
            <div className={s.container}>
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                    <ol className="breadcrumb">
                      <li className={s.breadcrumbItem}>
                        <i className="fa fa-building" aria-hidden="true"></i> Danh sách cư dân theo các căn hộ
                  </li>
                    </ol>
                  </Col>

                  <Col xs={12} className={s.filter}>
                    <form className="form-inline" name={form} noValidate onSubmit={handleSubmit(this.onSubmitFilter)}>
                      <Col sm={3} xsHidden className={s.label}>
                        <FormGroup controlId="labelFiltering">
                          <ControlLabel>Tìm kiếm theo</ControlLabel>
                        </FormGroup>
                      </Col>
                      <Col sm={3} className={s.apartment}>
                        <FormGroup controlId="apartmentFiltering">
                          <Field
                            type="text"
                            name="filterByApartment"
                            component={InputField}
                            placeholder="Tên hoặc số căn hộ"
                            validate={[Validator.Required.Unless(null, 'Bạn phải nhập dữ liệu', () => !isString(currentValues.filterByResident) || String(currentValues.filterByResident).trim().length === 0)]}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={3} className={s.resident}>
                        <FormGroup controlId="residentFiltering">
                          <Field
                            type="text"
                            name="filterByResident"
                            component={InputField}
                            placeholder="Tên của cư dân"
                            validate={[Validator.Required.Unless(null, 'Bạn phải nhập dữ liệu', () => !isString(currentValues.filterByApartment) || String(currentValues.filterByApartment).trim().length === 0)]}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={3} className={s.button}>
                        <FormGroup controlId="submitFiltering">
                          <Button type="submit" bsStyle="primary" disabled={pristine || submitting || invalid}>Xem</Button>
                        </FormGroup>
                      </Col>
                    </form>
                  </Col>

                  <Col xs={12} className={s.stats}>
                    <Row>
                      <Col className="pull-left" xs={8}>
                        <i className="fa fa-bar-chart" aria-hidden="true"></i> Tòa nhà hiện có {residentsInBuildingGroupByApartment.stats.numberOfApartments} căn hộ và {residentsInBuildingGroupByApartment.stats.numberOfResidents} cư dân.
                      </Col>
                      <Col className="pull-right" xs={4}>
                        <a onClick={this.onExportToExcel(buildingId)} title="Tải xuống với định dạng excel"><i className="fa fa-file-excel-o" aria-hidden="true"></i></a>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12}>
                    <DeleteResidentModal
                      onDelete={this.onDeleteResident}
                      onError={this.onErrorWhenDeleteResident}
                      initialValues={this.state.deleteResidentValues}
                      onHide={this.onHideDeleteResidentModal}
                    />
                    {this.state.errorMessage && (<Alert bsStyle="danger" onDismiss={() => this.setState({ errorMessage: null })}>
                      { this.state.errorMessage }
                    </Alert>)}
                    {this.datatable()}
                  </Col>
                  <Col xs={12} className="pull-right">
                    <Pagination
                      total={residentsInBuildingGroupByApartment.pageInfo.total}
                      page={residentsInBuildingGroupByApartment.pageInfo.page}
                      limit={residentsInBuildingGroupByApartment.pageInfo.limit}
                      onChange={this.onChangePage}
                    />
                  </Col>
                </Row>
              </Col>
              <Clearfix />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

GroundManagement.propTypes = {
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
  onChangePage: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    residentsInBuildingGroupByApartment: PropTypes.shape({
      pageInfo: PropTypes.object,
      stats: PropTypes.object,
      edges: PropTypes.array,
    }),
  }).isRequired,
  currentValues: PropTypes.object,
  fields: PropTypes.array.isRequired,
  onDeleteResident: PropTypes.func.isRequired,
  onExportToExcel: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  initialize: PropTypes.func.isRequired,
};

GroundManagement.defaultProps = {
  data: {
    residentsInBuildingGroupByApartment: {
      pageInfo: {
        page: 1,
      },
      stats: {
        numberOfApartments: 0,
        numberOfResidents: 0,
      },
      edges: [],
    },
  },
};

const fields = [
  'filterByApartment',
  'filterByResident',
];

const GroundManagementForm = reduxForm({
  form: 'GroundFilteringManagement',
  fields,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(compose(
  withStyles(s),
  graphql(ResidentsInBuildingGroupByApartmentQuery, {
    options: props => ({
      variables: {
        building: props.buildingId,
        filters: {},
      },
    }),
    props: ({ data }) => {
      const onChangePage = ({ page, filters }) => data.fetchMore({
        query: ResidentsInBuildingGroupByApartmentQuery,
        variables: {
          ...data.variables,
          filters,
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
  graphql(DeleteResidentInBuildingMutation, {
    props: ({ mutate }) => ({
      onDeleteResident: input => mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteResidentInBuilding: {
            __typename: 'User',
            _id: input.resident,
          },
        },
        updateQueries: {
          ResidentsInBuildingGroupByApartmentQuery: (previousResult) => {
            const { residentsInBuildingGroupByApartment } = previousResult;
            const apartmentPos = residentsInBuildingGroupByApartment.edges.findIndex(item => item._id === input.apartment);
            const { residents } = residentsInBuildingGroupByApartment.edges[apartmentPos];
            let residentIndex;
            if (Array.isArray(residents) && residents.length > 0) {
              residentIndex = residents.findIndex(item => item._id === input.resident);
            }
            return update(previousResult, {
              residentsInBuildingGroupByApartment: {
                edges: {
                  [apartmentPos]: {
                    residents: {
                      $splice: [[residentIndex, 1]],
                    },
                  },
                },
              },
            });
          },
        },
      }),
    }),
  }),
  graphql(ExportResidentsInBuildingGroupByApartmentMutation, {
    props: ({ mutate }) => ({
      onExportToExcel: variables => mutate({
        variables,
      }),
    }),
  }),
)(GroundManagement));

const mapStateToProps = state => ({
  user: state.user,
  currentValues: formValueSelector('GroundFilteringManagement')(state, ...fields),
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(GroundManagementForm);
