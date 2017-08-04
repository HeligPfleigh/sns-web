import React, { Component } from 'react';
import { Panel, Image } from 'react-bootstrap';

class Sponsored extends Component {

  render() {
    return (
      <Panel>
        <h6>Sponsored</h6>
        <Image style={{
          width: 230,
        }} src="https://bootstrap-themes.github.io/application/assets/img/instagram_2.jpg" rounded responsive />
        <p>
          <strong>It might be time to visit Iceland.</strong> <br />
          Iceland is so chill, and everything looks cool here.
          Also, we heard the people are pretty nice. What are you waiting for?
        </p>
      </Panel>
    );
  }
}

Sponsored.propTypes = {};
Sponsored.defaultProps = {};

export default Sponsored;
