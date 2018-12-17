import React from 'react'
import PropTypes from 'prop-types'
import {XYZ} from 'ol/source'
import OLSource from './ol-source'

class OLXYZ extends OLSource {
    _createSourceFromProps(props) {
        return new XYZ(Object.assign({}, props))
    }
}

OLXYZ.propTypes = {
    url: PropTypes.string
}

export default OLXYZ
