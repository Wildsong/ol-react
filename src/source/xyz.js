import React from 'react';
import PropTypes from 'prop-types';
import {Source, XYZ} from 'ol/source';
import OLSourceComponent from './ol-source-component';

class OLXYZ extends OLSourceComponent {
    constructor(props) {
        super(props);
    }

    _createSourceFromProps(props) {
        return new XYZ(Object.assign({}, props))
    }

    getChildContext() {
        return {
            source: this.source
        }
    }
}

OLXYZ.propTypes = {
    url: PropTypes.string
}

OLXYZ.childContextTypes = {
    source: PropTypes.instanceOf(Source)
}

export default OLXYZ
