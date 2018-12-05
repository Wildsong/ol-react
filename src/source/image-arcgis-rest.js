import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Source, ImageArcGISRest} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSourceComponent from './ol-source-component'
//???? import * as interaction from '../interaction'

class OLImageArcGISRest extends OLSourceComponent {
  constructor(props) {
    super(props);
  }

  _createSourceFromProps(props) {
      return new ImageArcGISRest(Object.assign({}, props))
  }

  getChildContext() {
    return {
      source: this.source
    }
  }

  componentDidMount() {
    this.context.layer.setSource(this.source)
  }

  componentWillUnmount() {}
}

OLImageArcGISRest.propTypes = {
  ratio: PropTypes.number,
  //url: PropTypes.string.isRequired
}

OLImageArcGISRest.defaultProps = {
  ratio: 1
}

OLImageArcGISRest.contextTypes = {
  layer: PropTypes.instanceOf(BaseLayer),
  map: PropTypes.instanceOf(Map)
}

OLImageArcGISRest.childContextTypes = {
  source: PropTypes.instanceOf(Source)
}

export default OLImageArcGISRest;
