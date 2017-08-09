import React, { PropTypes } from 'react';
import MediaQuery from 'react-responsive';

class VideoView extends React.Component {
  render() {
    return (
      <div>
        {this.props.isShow ?
          <iframe
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${this.props.src}`}
            frameBorder="0"
            allowFullScreen
          ></iframe> : null
          }
      </div>
    );
  }
}
VideoView.PropTypes = {
  src: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired,
};
export default VideoView;
