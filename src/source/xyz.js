import React from 'react';
import PropTypes from 'prop-types';
import {XYZ} from 'ol/source';
import OLSourceComponent from './ol-source-component';

class OLXYZ extends OLSourceComponent {
    _createSourceFromProps(props) {
        return new XYZ(Object.assign({}, props))
    }
}

OLXYZ.propTypes = {
    url: PropTypes.string
}

export default OLXYZ
