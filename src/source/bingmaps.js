import React from 'react';
import PropTypes from 'prop-types';
import {BingMaps} from 'ol/source';
import OLSource from './ol-source';

class OLBingMaps extends OLSource {
    _createSourceFromProps(props) {
        let spreadedProps = Object.assign({}, props)
        spreadedProps.key = spreadedProps.apiKey
        delete spreadedProps.apiKey
        return new BingMaps(spreadedProps)
    }
}

OLBingMaps.propTypes = {
    apiKey: PropTypes.string.isRequired
}

export default OLBingMaps;
