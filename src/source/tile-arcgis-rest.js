import React from 'react';
import PropTypes from 'prop-types';
import {Source, TileArcGISRest} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLSourceComponent from './ol-source-component'

class OLTileArcGISRest extends OLSourceComponent {
  constructor(props) {
    super(props);
  }

  _createSourceFromProps(props) {
        console.log("tile-arcgis-rest ", props)
        return new TileArcGISRest(props);
  }

  getChildContext() {
    return {
      source: this.source
    }
  }

/*
  componentDidMount() {
    this.context.layer.setSource(this.source)
  }

  componentWillUnmount() {}
  */
}

OLTileArcGISRest.propTypes = {
//  ratio: PropTypes.number,
//  url: PropTypes.string.isRequired
}

//OLTileArcGISRest.defaultProps = {
//  ratio: 1
//}
//
//OLTileArcGISRest.contextTypes = {
//  layer: PropTypes.instanceOf(BaseLayer)
//}
//
//OLTileArcGISRest.childContextTypes = {
//  source: PropTypes.instanceOf(Source)
//}

export default OLTileArcGISRest;
