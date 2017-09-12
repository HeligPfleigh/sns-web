import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import { compose, graphql } from 'react-apollo';
import DateTime from 'react-datetime';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Grid,
  Row,
  Col,
  Clearfix,
  Alert,
  Button,
  Dropdown,
  MenuItem,
} from 'react-bootstrap';

import s from './BuildingService.scss';
import Loading from '../../../components/Loading';
import FAQs from '../../../components/MyBuildings/FAQs';
import Documents from '../../../components/MyBuildings/Documents';
import FAQsAndDocumentsQueries from './graphql/FAQsAndDocumentsQueries.graphql';
import FeeTablePerMonth from '../../../components/Apartment/FeeServices/FeeTablePerMonth';
import feesOfApartment from './graphql/FeesOfApartment.graphql';

class BuildingService extends Component {

  constructor(props) {
    super(props);
    const { apartments } = props;
    this.state = {
      isOpen: false,
      viewMode: 'months',
      dateValue: undefined,
      unitSelect: !isEmpty(apartments) && apartments[0],
      feeType: (props.query && props.query.feeType) || null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { unitSelect } = this.state;
    if (!isEmpty(nextProps.apartments) && isEmpty(unitSelect)) {
      const { apartments } = nextProps;
      this.setState(prevState => ({
        ...prevState,
        unitSelect: apartments && apartments[0],
      }));
    }
  }

  dateChange = (val) => {
    const { viewMode } = this.state;
    if (viewMode === 'months') {
      this.setState(prevState => ({
        ...prevState,
        dateValue: val,
        isOpen: false,
      }), () => {
        this.handleFilter();
      });
    }
  }

  dateViewMode = (mode) => {
    this.setState({ viewMode: mode });
  }

  selectApartment = (item) => {
    this.setState(prevState => ({
      ...prevState,
      unitSelect: item,
    }), () => {
      this.handleFilter();
    });
  }

  resetFilter = () => {
    const { apartments } = this.props;
    this.setState(prevState => ({
      ...prevState,
      dateValue: undefined,
      unitSelect: !isEmpty(apartments) && apartments[0],
    }), () => {
      this.handleFilter();
    });
  }

  handleFilter = () => {
    const { dateValue, unitSelect, feeType } = this.state;

    const options = {
      feeType,
      apartmentId: unitSelect && unitSelect._id,
    };

    if (dateValue) {
      const month = dateValue.toDate().getMonth() + 1;
      const year = dateValue.toDate().getFullYear();
      const feeDate = `${month}-${year}`;
      options.feeDate = feeDate;
    }

    if (!isEmpty(options)) {
      const { loadMoreRows } = this.props;
      loadMoreRows({ ...options });
    }
  }

  render() {
    const {
      fees,
      loading,
      listFAQ,
      documents,
      buildingId,
      apartments,
    } = this.props;

    const { unitSelect, dateValue, isOpen } = this.state;

    // Show loading
    if (loading) {
      return <Loading show={loading} full>Đang tải ...</Loading>;
    }

    return (
      <Grid>
        <Row className={classNames(s.containerTop30)}>
          <Col md={8} sm={12} xs={12}>
            <div className={classNames(s.container)}>
              <Row>
                <Col sm={4} className={classNames(s.header)}>
                  <i className={classNames('fa fa-home', s.homeIcon)} aria-hidden="true"></i>
                  {
                    !isEmpty(apartments) &&
                    <Dropdown id={Math.random()}>
                      <Dropdown.Toggle value={unitSelect && unitSelect._id}>
                        { unitSelect && unitSelect.name }
                      </Dropdown.Toggle>
                      <Dropdown.Menu onSelect={this.selectApartment}>
                        {
                          (apartments || []).map(item => (
                            <MenuItem
                              key={Math.random()}
                              eventKey={item}
                              active={isEqual(unitSelect, item)}
                            >
                              { item.name }
                            </MenuItem>
                          ))
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                </Col>
                <Col smOffset={3} sm={5}>
                  <DateTime
                    locale="vi"
                    inputProps={{
                      readOnly: true,
                      placeholder: 'DD-YYYY',
                    }}
                    viewMode="months"
                    dateFormat="MM-YYYY"
                    open={isOpen}
                    timeFormat={false}
                    defaultValue={dateValue}
                    value={dateValue}
                    onChange={this.dateChange}
                    onViewModeChange={this.dateViewMode}
                  />
                  <Button bsStyle="info" onClick={this.resetFilter}>
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </Button>
                </Col>
                <Clearfix />
              </Row>
              <Row>
                <Col md={12}>
                  { fees && isEmpty(fees) &&
                    <Alert bsStyle="warning" style={{ margin: '20px 0px 5px' }}>
                      Hiện căn hộ của bạn chưa có thông tin phí nào!
                    </Alert>
                  }
                  { fees && !isEmpty(fees) &&
                    fees.map(fee => <FeeTablePerMonth
                      key={Math.random() * 10000}
                      fee={fee}
                    />)
                  }
                </Col>
                <Clearfix />
              </Row>
            </div>
          </Col>
          <MediaQuery minDeviceWidth={992} values={{ deviceWidth: 1600 }}>
            <Col md={4} smHidden xsHidden>
              <Row>
                <Col md={12}>
                  { listFAQ && <FAQs
                    buildingId={buildingId}
                    listFAQ={listFAQ}
                    styles={{ backgroundColor: '#fff' }}
                  /> }
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  { documents && <Documents
                    buildingId={buildingId}
                    documents={documents}
                    styles={{ backgroundColor: '#fff' }}
                  /> }
                </Col>
              </Row>
            </Col>
          </MediaQuery>
        </Row>
      </Grid>
    );
  }
}

BuildingService.propTypes = {
  fees: PropTypes.array,
  query: PropTypes.any,
  loadMoreRows: PropTypes.func,
  listFAQ: PropTypes.array,
  documents: PropTypes.array,
  apartments: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  withStyles(s),
  connect(state => ({
    user: state.user,
  })),
  graphql(FAQsAndDocumentsQueries, {
    options: ownProps => ({
      variables: {
        limit: 4,
        building: ownProps.buildingId,
      },
    }),
    props: ({ data }) => {
      const {
        loading,
        FAQs: listFAQ,
        documents: docs,
        apartmentsOfUserByBuilding,
      } = data;

      return {
        loading,
        documents: docs && docs.edges,
        listFAQ: listFAQ && listFAQ.edges,
        apartments: apartmentsOfUserByBuilding,
      };
    },
  }),
  graphql(feesOfApartment, {
    options: ownProps => ({
      variables: {
        feeType: (ownProps.query && ownProps.query.feeType) || null,
        apartmentId: !isEmpty(ownProps.apartments) && ownProps.apartments[0]._id,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      const { fetchMore } = data;
      const loadMoreRows = throttle(variables => fetchMore({
        variables,
        fetchPolicy: 'network-only',
        updateQuery: (_, { fetchMoreResult }) => fetchMoreResult,
      }), 300);
      return {
        loadMoreRows,
        fees: data.feesOfApartment || [],
      };
    },
  }),
)(BuildingService);
