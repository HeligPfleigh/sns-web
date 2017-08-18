import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Lightbox from 'react-images';
import { generate as idRandom } from 'shortid';
import s from './Gallery.scss';

class Gallery extends Component {
  constructor() {
    super();
    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
    };
  }

  openLightbox = (index, event) => {
    event.preventDefault();
    this.setState({
      currentImage: index,
      lightboxIsOpen: true,
    });
  }
  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }
  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }
  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }
  gotoImage = (index) => {
    this.setState({
      currentImage: index,
    });
  }
  handleClickImage = () => {
    if (this.state.currentImage === this.props.images.length - 1) return;
    this.gotoNext();
  }

  renderGallery = () => {
    const { images } = this.props;
    if (!images) return;
    const gallery = images.slice(0, 4).map((obj, i) => {
      const numberThumbnailLeft = images.length - 4;
      return (
        <div className={s.thumbnailFrame} key={idRandom()}>
          { images.length > 4 && i === 3 ? (
            <a
              href={obj.src}
              className={s.thumbnail}
              onClick={e => this.openLightbox(i, e)}
            >
              <div className={s.numberThumbnailLeft}>
                <div className={s.text}>
                  <span>+{numberThumbnailLeft}</span>
                </div>
              </div>
              <img src={obj.thumbnail} className={s.source} />
            </a>
          ) : (
            <a
              href={obj.src}
              className={s.thumbnail}
              onClick={e => this.openLightbox(i, e)}
            >
              <img src={obj.thumbnail} className={s.source} />
            </a>
          )}
        </div>
      );
    });
    return (
      <div className={s.gallery}>
        {gallery}
      </div>
    );
  }

  render() {
    return (
      <div className="section">
        {this.renderGallery()}
        <Lightbox
          currentImage={this.state.currentImage}
          images={this.props.images}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickNext={this.gotoNext}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.gotoImage}
          onClose={this.closeLightbox}
          showThumbnails={this.props.showThumbnails}
        />
      </div>
    );
  }
}

Gallery.propTypes = {
  images: PropTypes.array,
  showThumbnails: PropTypes.bool,
};

export default withStyles(s)(Gallery);
