import React from 'react';
import PropTypes from 'prop-types';
import Source from 'ol/source/Source';
import TileWMS from 'ol/source/TileWMS';
import OLSourceComponent from './ol-source-component';

class OLTileWMS extends OLSourceComponent {
    constructor(props) {
        super(props);
    }

    _createSourceFromProps(props) {
        return new TileWMS(Object.assign({}, props))
    }

    getChildContext() {
        return {
            source: this.source
        }
    }
}

OLTileWMS.propTypes = {
//    params: PropTypes.object.isRequired,
    url: PropTypes.string
}

OLTileWMS.childContextTypes = {
    source: PropTypes.instanceOf(Source)
}

export default OLTileWMS
