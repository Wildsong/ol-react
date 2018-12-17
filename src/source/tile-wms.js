import React from 'react'
import PropTypes from 'prop-types'
import TileWMS from 'ol/source/TileWMS'
import OLSource from './ol-source'

class OLTileWMS extends OLSource {
    _createSourceFromProps(props) {
        return new TileWMS(Object.assign({}, props))
    }
}

OLTileWMS.propTypes = {
//    params: PropTypes.object.isRequired,
    url: PropTypes.string
}

export default OLTileWMS
