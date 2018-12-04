import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Source, ImageArcGISRest} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLComponent from '../ol-component'
import * as interaction from '../interaction'

class ReactImageArcGISRest extends OLComponent {
  constructor(props) {
    super(props);
    this.source = new ImageArcGISRest(Object.assign({}, props))
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

ReactImageArcGISRest.propTypes = {
  ratio: PropTypes.number,
  //url: PropTypes.string.isRequired
}

ReactImageArcGISRest.defaultProps = {
  ratio: 1
}

ReactImageArcGISRest.contextTypes = {
  layer: PropTypes.instanceOf(BaseLayer),
  map: PropTypes.instanceOf(Map)
}

ReactImageArcGISRest.childContextTypes = {
  source: PropTypes.instanceOf(Source)
}

export default ReactImageArcGISRest;
