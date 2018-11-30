import React from 'react';
import PropTypes from 'prop-types';

import {BingMaps} from 'ol/source';
import BaseLayer from 'ol/layer/Base';

import OLComponent from '../ol-component';

class ReactBingMaps extends OLComponent {
    constructor(props) {
        let spreadedProps = Object.assign({}, props)
        spreadedProps.key = spreadedProps.apiKey
        delete spreadedProps.apiKey
        super(props)
        this.source = new BingMaps(spreadedProps)
    }

    componentDidMount() {
        this.context.layer.setSource(this.source)
    }
}

ReactBingMaps.propTypes = {
    apiKey: PropTypes.string.isRequired
}

ReactBingMaps.contextTypes = {
    layer: PropTypes.instanceOf(BaseLayer)
}

export default ReactBingMaps;
