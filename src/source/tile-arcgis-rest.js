import React from 'react'
import PropTypes from 'prop-types'
import {TileArcGISRest} from 'ol/source'
import OLSource from './ol-source'

class OLTileArcGISRest extends OLSource {
    constructor(props) {
        super(props);
        this.state = { source: new TileArcGISRest(this.props) };
    }
}

OLTileArcGISRest.propTypes = {
//  ratio: PropTypes.number,
    url: PropTypes.string.isRequired
}

//OLTileArcGISRest.defaultProps = {
//  ratio: 1
//}
//
//OLTileArcGISRest.contextTypes = {
//  layer: PropTypes.instanceOf(BaseLayer)
//}

export default OLTileArcGISRest
