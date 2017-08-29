import React, { PropTypes } from 'react';
import {
  Col,
} from 'react-bootstrap';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FeeServices.scss';
import FeeTablePerMonth from './FeeTablePerMonth/FeeTablePerMonth';
import Divider from '../../Divider';

class FeeServices extends React.Component {
  render() {
    const { fees, apartment } = this.props;
    return (
      <div className={s.container}>
        <Col md={12} className={s.contentMain}>
          <div className={s.header}>
            <i className={`fa fa-home ${s.homeIcon}`} aria-hidden="true"></i>
            {apartment && <h5>{`Căn hộ: ${apartment.name}`}</h5>}
          </div>
          <div className={s.content}>
            {
              fees.map(fee => <FeeTablePerMonth
                key={Math.random() * 10000}
                fee={fee}
              />)
            }
          </div>
        </Col>
      </div>
    );
  }
}

FeeServices.propTypes = {
  apartment: PropTypes.object,
  fees: PropTypes.array,
};

export default compose(
  withStyles(s),
)(FeeServices);
