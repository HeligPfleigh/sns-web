import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import Loading from '../../../components/Loading';
import s from './MyBuilding.scss';

class MyBuilding extends Component {
  state= {
    loading: false,
  }
  render() {
    const { loading } = this.state;
    const { buildingId, user } = this.props;

    return (
      <Grid className={classNames(s.containerTop30)}>
        <Loading show={loading} full>Đang tải ...</Loading>
        <Col md={12} className={classNames(s.container)}>
          <div className={classNames(s.banner)}>
            <Image src="/images/banner.png" className={classNames(s.img)} />
            <div className={classNames(s.boxText)}>
              <h2> Khai trương bể bơi</h2>
              <h2>hè 2017</h2>
              <a href="#" className={classNames(s.link)}>ĐĂNG KÝ NGAY</a>
            </div>
          </div>
          <div className={classNames(s.mainContent)}>
            <Row>
              <Col md={6} sm={6} xs={12}>
                <div className={classNames(s.boxContent, s.bgOrange)}>
                  <h2 className={classNames(s.title)}>Thông báo mới nhất</h2>
                  <ul className={classNames(s.listItem, s.thongBao)}>
                    <li className={classNames(s.red)}>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <div className={classNames(s.boxContent)}>
                  <h2 className={classNames(s.title)}>
                    Các thông báo khác <a href="#" className={classNames(s.link)}>{'Xem thêm >>'}</a>
                  </h2>
                  <ul className={classNames(s.listItem, s.thongBao)}>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-bullhorn')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <h2 className={classNames(s.titleTab)}>
                  <span>Dịch vụ & Tiện ích tòa nhà</span>
                </h2>
              </Col>
            </Row>
            <Row className={classNames('row', s.boxItemService)}>
              <Col xs={12} sm={6} md={4}>
                <a href="#" className={classNames(s.itemService)}>
                  <Image src="/images/img_dien.png" />
                  <div className={classNames(s.boxTextItemService)}>
                    <h2><span>Điện sinh hoạt</span></h2>
                  </div>
                </a>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <a href="#" className={classNames(s.itemService)}>
                  <Image src="/images/img_nuoc.png" />
                  <div className={classNames(s.boxTextItemService)}>
                    <h2><span>Nước sinh hoạt</span></h2>
                  </div>
                </a>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <a href="#" className={classNames(s.itemService)}>
                  <Image src="/images/img_guixe.png" />
                  <div className={classNames(s.boxTextItemService)}>
                    <h2><span>Dịch vụ gửi xe</span></h2>
                  </div>
                </a>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <a href="#" className={classNames(s.itemService)}>
                  <Image src="/images/img_phidichvu.png" />
                  <div className={classNames(s.boxTextItemService)}>
                    <h2><span>Phí dịch vụ</span></h2>
                  </div>
                </a>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <a href="#" className={classNames(s.itemService)}>
                  <Image src="/images/img_giupviec.png" />
                  <div className={classNames(s.boxTextItemService)}>
                    <h2><span>Sửa chữa & Giúp việc</span></h2>
                  </div>
                </a>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <a href="#" className={classNames(s.itemService)}>
                  <Image src="/images/img_bacsi.png" />
                  <div className={classNames(s.boxTextItemService)}>
                    <h2><span>Bác sĩ tại nhà</span></h2>
                  </div>
                </a>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={6} xs={12}>
                <div className={classNames(s.boxContent)}>
                  <h2 className={classNames(s.title)}>
                    Hỏi - đáp <a href="#" className={classNames(s.link)}>{'Xem thêm >>'}</a>
                  </h2>
                  <ul className={classNames(s.listItem)}>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-comment')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-comment')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-comment')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-comment')}></i>
                        <h3>Thông báo thay đổi phí dịch vụ tòa nhà</h3>
                        <p className={classNames(s.time)}>11.00 AM   15 tháng 4</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <div className={classNames(s.boxContent)}>
                  <h2 className={classNames(s.title)}>
                    Biểu mẫu<a href="#" className={classNames(s.link)}>{'Xem thêm >>'}</a>
                  </h2>
                  <ul className={classNames(s.listItem)}>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-file-pdf-o')}></i>
                        <h3>Bieu mau dang ky nop tien dien nuoc hang thang va cac dich vu thanh thanh toan khac</h3>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-file-pdf-o')}></i>
                        <h3>Bieu mau dang ky nop tien dien nuoc hang thang va cac dich vu thanh thanh toan khac</h3>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-file-pdf-o')}></i>
                        <h3>Bieu mau dang ky nop tien dien nuoc hang thang va cac dich vu thanh thanh toan khac</h3>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className={classNames('fa fa-file-pdf-o')}></i>
                        <h3>Bieu mau dang ky nop tien dien nuoc hang thang va cac dich vu thanh thanh toan khac</h3>
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Grid>
    );
  }
}

MyBuilding.propTypes = {
  user: PropTypes.object.isRequired,
  buildingId: PropTypes.string.isRequired,
};

export default compose(
  connect(state => ({
    user: state.user,
  })),
  withStyles(s),
)(MyBuilding);
