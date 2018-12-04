import React from 'react';
import PropTypes from 'prop-types';
import {OSM} from 'ol/source';
import BaseLayer from 'ol/layer/Base';
import OLComponent from '../ol-component';

class ReactOSM extends OLComponent {
    constructor(props) {
        super(props);
        this.source = new OSM(props);
    }

    componentDidMount() {
        this.context.layer.setSource(this.source);
    }
}

ReactOSM.propTypes = {
}

ReactOSM.contextTypes = {
    layer: PropTypes.instanceOf(BaseLayer)
}

export default ReactOSM;
