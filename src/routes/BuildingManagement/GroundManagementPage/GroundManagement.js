import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Clearfix, ControlLabel, Button, FormGroup } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import isString from 'lodash/isString';
import forEach from 'lodash/forEach';
import isObject from 'lodash/isObject';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import Table from 'rc-table';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import Validator from '../../../components/Validator';
import history from '../../../core/history';
import InputField from './InputField';
import ResidentsInApartmentBuilding from './ResidentsInApartmentBuilding.graphql';
import Menu from '../Menu/Menu';
import s from './GroundManagement.scss';

class GroundManagement extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      expandedRowKeys: [],
    };

    this.hasSubmitFiltering = false;
  }

  onBlurFilterInputs = (event, nextValue) => {
    if (this.hasFilterSubmitted && isString(nextValue) && String(nextValue).trim().length === 0) {
      const { fields, currentValues } = this.props;
      const hasSubmitFiltering = [];
      forEach(currentValues, (value, field) => {
        if (isString(value) || String(value).length === 0) {
          hasSubmitFiltering.push(field);
        }
      });
      this.hasFilterSubmitted = !(fields.length === hasSubmitFiltering.length);
      this.onChangePage(1);
    }
  }

  onChangePage = page => this.props.onChangePage({
    page,
    filters: this.hasFilterSubmitted ? this.getAllFilterInputs() : {},
  })

  onSubmitFilter = () => {
    this.hasFilterSubmitted = true;
    return this.onChangePage(1);
  }

  onExpandedRowsChange = (expandedRowKeys) => {
    this.setState({
      expandedRowKeys,
    });
  }

  getAllFilterInputs() {
    const { currentValues } = this.props;
    return {
      apartment: isString(currentValues.filterByApartment) ? String(currentValues.filterByApartment).trim() : '',
      resident: isString(currentValues.filterByResident) ? String(currentValues.filterByResident).trim() : '',
    };
  }

  viewResident = data => (
    <a
      href="#"
      onClick={(evt) => {
        evt.preventDefault();
        history.push(`/user/${data._id}?tab=MY_INFO`);
      }}
    >{'Thông tin cư dân >>'}</a>
  );

  viewApartment = () => (
    <a
      href="#"
      onClick={(evt) => {
        evt.preventDefault();
      }}
    >{'Thông tin căn hộ >>'}</a>
    );

  tableColumns = (expanded) => {
    if (expanded) {
      return [{
        title: 'Căn hộ', dataIndex: '', key: 'apartmentName', className: 'apartmentName',
      }, {
        title: 'Cư dân', dataIndex: 'residentName', key: 'residentName', className: 'residentName',
      }, {
        title: 'Vai trò', dataIndex: 'residentRole', key: 'residentRole', className: 'residentRole',
      }, {
        title: `${' '}`, dataIndex: '', key: 'actions', className: 'actions', render: this.viewResident,
      }];
    }

    return [{
      title: 'Căn hộ', dataIndex: 'apartmentName', key: 'apartmentName', className: 'apartmentName',
    }, {
      title: 'Cư dân', dataIndex: 'numberOfResidents', key: 'numberOfResidents', className: 'residentName',
    }, {
      title: 'Vai trò', dataIndex: '', key: 'residentRole', className: 'residentRole',
    }, {
      title: `${' '}`, dataIndex: '', key: 'actions', className: 'actions', render: this.viewApartment,
    }];
  }

  datatable() {
    const {
      data: {
        residentsInApartmentBuilding,
      },
    } = this.props;

    const { expandedRowKeys } = this.state;

    const data = [];
    const defaultExpandedRowKeys = [];
    if (isObject(residentsInApartmentBuilding) && Array.isArray(residentsInApartmentBuilding.edges)) {
      residentsInApartmentBuilding.edges.forEach((rows) => {
        const residents = [];
        if (Array.isArray(rows.residents)) {
          rows.residents.forEach((resident) => {
            residents.push({
              _id: resident._id,
              residentName: (isObject(resident.profile) && resident.profile.fullName) || resident.name,
              residentRole: resident._id === rows.owner ? 'Chủ hộ' : 'Người thuê nhà',
            });

            if (defaultExpandedRowKeys.length === 0 && this.hasFilterSubmitted) {
              defaultExpandedRowKeys.push(rows._id);
            }
          });
        }

        data.push({
          _id: rows._id,
          apartmentName: rows.name,
          numberOfResidents: `Có tổng số ${residents.length} cư dân`,
          residents,
        });
      });
    }
    return (<Table
      rowKey="_id"
      data={data}
      expandIconAsCell
      expandRowByClick
      columns={this.tableColumns(false)}
      emptyText="Hiện tại không có dữ liệu."
      expandedRowKeys={expandedRowKeys}
      expandedRowRender={this.expandedRowRender}
      onExpandedRowsChange={this.onExpandedRowsChange}
      className={s.datatable}
      defaultExpandedRowKeys={defaultExpandedRowKeys}
    />);
  }

  expandedRowRender = record => (
    <Table
      rowKey="_id"
      showHeader={false}
      columns={this.tableColumns(true)}
      emptyText="Hiện tại không có dữ liệu."
      data={record.residents}
    />
    )

  render() {
    const {
      buildingId,
      user,
      data: {
        loading,
        residentsInApartmentBuilding,
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
                            onBlur={this.onBlurFilterInputs}
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
                            onBlur={this.onBlurFilterInputs}
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
                        <i className="fa fa-bar-chart" aria-hidden="true"></i> Tòa nhà hiện có {residentsInApartmentBuilding.stats.numberOfApartments} căn hộ và {residentsInApartmentBuilding.stats.numberOfResidents} cư dân.
                      </Col>
                      <Col className="pull-right" xs={4}>
                        <i className="fa fa-file-excel-o" aria-hidden="true" title="Tải xuống với định dạng excel"></i>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12}>
                    {this.datatable()}
                    {/* <Table className={s.datatable} responsive hover condensed striped>
                      <thead>
                        <tr>
                          <th>Căn hộ</th>
                          <th>Diện tích</th>
                          <th>Số phòng ngủ</th>
                          <th>Hướng cửa</th>
                          <th>Tình trạng</th>
                          <th>&nbsp; </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>304</td>
                          <td>117.8m2</td>
                          <td>3</td>
                          <td>TB</td>
                          <td>Trống</td>
                          <td><a href="#">Chi tiết>></a></td>
                        </tr>
                        <tr>
                          <td>304</td>
                          <td>117.8m2</td>
                          <td>3</td>
                          <td>TB</td>
                          <td>Trống</td>
                          <td><a href="#">Chi tiết>></a></td>
                        </tr>
                        <tr>
                          <td>304</td>
                          <td>117.8m2</td>
                          <td>3</td>
                          <td>TB</td>
                          <td>Trống</td>
                          <td><a href="#">Chi tiết>></a></td>
                        </tr>
                        <tr>
                          <td>304</td>
                          <td>117.8m2</td>
                          <td>3</td>
                          <td>TB</td>
                          <td>Trống</td>
                          <td><a href="#">Chi tiết>></a></td>
                        </tr>
                        <tr>
                          <td>304</td>
                          <td>117.8m2</td>
                          <td>3</td>
                          <td>TB</td>
                          <td>Trống</td>
                          <td><a href="#">Chi tiết>></a></td>
                        </tr>
                        <tr>
                          <td>304</td>
                          <td>117.8m2</td>
                          <td>3</td>
                          <td>TB</td>
                          <td>Trống</td>
                          <td><a href="#">Chi tiết>></a></td>
                        </tr>
                      </tbody>
                    </Table> */}
                  </Col>
                  <Col xs={12} className="pull-right">
                    <Pagination
                      total={residentsInApartmentBuilding.pageInfo.total}
                      page={residentsInApartmentBuilding.pageInfo.page}
                      limit={residentsInApartmentBuilding.pageInfo.limit}
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
    loading: PropTypes.bool.isRequired,
    residentsInApartmentBuilding: PropTypes.shape({
      pageInfo: PropTypes.object,
      stats: PropTypes.object,
      edges: PropTypes.array,
    }).isRequired,
  }).isRequired,
  currentValues: PropTypes.object,
  fields: PropTypes.array,
};

GroundManagement.defaultProps = {
  data: {
    residentsInApartmentBuilding: {
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
})(compose(
  withStyles(s),
  graphql(ResidentsInApartmentBuilding, {
    options: props => ({
      variables: {
        building: props.buildingId,
        filters: {},
      },
    }),
    props: ({ data }) => {
      const onChangePage = ({ page, filters }) => data.fetchMore({
        query: ResidentsInApartmentBuilding,
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
)(GroundManagement));

const mapStateToProps = state => ({
  user: state.user,
  currentValues: formValueSelector('GroundFilteringManagement')(state, ...fields),
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(GroundManagementForm);
