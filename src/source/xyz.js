import React from 'react'
import PropTypes from 'prop-types'
import {XYZ} from 'ol/source'
import OLSource from './ol-source'

class OLXYZ extends OLSource {
    constructor(props) {
        super(props);
        this.state = { source: new XYZ(this.props) };
    }
}

OLXYZ.propTypes = {
    url: PropTypes.string
}

export default OLXYZ
