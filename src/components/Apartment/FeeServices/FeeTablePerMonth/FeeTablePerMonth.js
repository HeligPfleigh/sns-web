import React, { PropTypes } from 'react';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FeeTablePerMonth.scss';

class FeeTablePerMonth extends React.Component {
  render() {
    const { fee } = this.props;
    return (
      <table style={{ width: '100%', textAlign: 'right', marginTop: 20 }}>
        <thead className={s.styleHeaderBottom}>
          <tr>
            <th><h4>{`${fee.month}/${fee.year}`}</h4></th>
            <th className={`${s.styleHeader} ${s.stylePayment}`}><h4>{`${fee.totals.toLocaleString()}₫`}</h4></th>
            <th className={s.styleHeader}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {
            (fee.detail || []).map(item => (
              <tr key={Math.random() * 10000} className={s.itemBody}>
                <td className={`${s.styleBodyFeeType} ${s.styleTextBold}`}>
                  <div className={s.circleIcon}><i className={classNames(item.type.icon)} /></div>
                  {item.type.name}
                </td>
                <td className={s.styleTextBold}>{`${item.total.toLocaleString()}₫`}</td>
                <td>{item.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
              </tr>
              ))
          }
        </tbody>
      </table>
    );
  }
}

FeeTablePerMonth.propTypes = {
  fee: PropTypes.object,
};

export default withStyles(s)(FeeTablePerMonth);
