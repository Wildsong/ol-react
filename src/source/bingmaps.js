import React from 'react';
import PropTypes from 'prop-types';
import {BingMaps} from 'ol/source';
import OLSource from './ol-source';

class OLBingMaps extends OLSource {
    constructor(props) {
        super(props);

        // This seems overly elaborate to me.
        let spreadedProps = Object.assign({}, this.props)
        spreadedProps.key = spreadedProps.apiKey
        delete spreadedProps.apiKey

        this.state = { source: new BingMaps(spreadedProps) }
    }
}

OLBingMaps.propTypes = {
    apiKey: PropTypes.string.isRequired
}

export default OLBingMaps;
