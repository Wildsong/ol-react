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
        return new TileArcGISRest(Object.assign({}, props));
    }

    getChildContext() {
        return {
            source: this.source
        }
    }
}

OLTileArcGISRest.propTypes = {
//  ratio: PropTypes.number,
    url: PropTypes.string.isRequired
}

OLTileArcGISRest.childContextTypes = {
    source: PropTypes.instanceOf(Source)
}

//OLTileArcGISRest.defaultProps = {
//  ratio: 1
//}
//
//OLTileArcGISRest.contextTypes = {
//  layer: PropTypes.instanceOf(BaseLayer)
//}

OLTileArcGISRest.childContextTypes = {
    source: PropTypes.instanceOf(Source)
}

export default OLTileArcGISRest;
