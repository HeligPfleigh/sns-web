import React, { PropTypes } from 'react';
import {
  Col,
} from 'react-bootstrap';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FeeServices.scss';
import FeeTablePerMonth from './FeeTablePerMonth/FeeTablePerMonth';

class FeeServices extends React.Component {
  render() {
    const { fees, apartment } = this.props;
    return (
      <div className={s.container}>
        <Col md={12} className={s.contentMain}>
          <div className={s.header}>
            <i className={`fa fa-home ${s.homeIcon}`} aria-hidden="true"></i>
            <h5>{`Căn hộ: ${apartment.name}`}</h5>
          </div>
          <div className={s.content}>
            {
              fees.map(fee => <FeeTablePerMonth
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
