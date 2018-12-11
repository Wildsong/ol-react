import React from 'react';
import PropTypes from 'prop-types';
import {TileArcGISRest} from 'ol/source';
import OLSourceComponent from './ol-source-component'

class OLTileArcGISRest extends OLSourceComponent {
    _createSourceFromProps(props) {
        return new TileArcGISRest(Object.assign({}, props));
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

export default OLTileArcGISRest;
