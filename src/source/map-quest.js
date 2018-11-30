import React from 'react';
import PropTypes from 'prop-types';

import {Map} from 'ol';
import {Source, MapQuest} from 'ol/source';
import BaseLayer from 'ol/layer/Base';

import OLComponent from '../ol-component';

class ReactMapQuest extends OLComponent {
  constructor(props) {
    super(props);
    console.log("MapQuest is ", MapQuest);
    this.source = new MapQuest(this.props);
  }

  componentDidMount() {
    this.context.layer.setSource(this.source);
  }
}

ReactMapQuest.propTypes = {
    //layer: PropTypes.string.isRequired
}

ReactMapQuest.contextTypes = {
    layer: PropTypes.instanceOf(BaseLayer)
}

export default ReactMapQuest;
