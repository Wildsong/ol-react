import PropTypes from 'prop-types';
import React from 'react';
import {XYZ} from 'ol/source';
import {BaseLayer} from 'ol/layer/Base';
import OLComponent from '../ol-component';

class ReactXYZ extends OLComponent {
    constructor(props) {
        super(props);
        this.source = new XYZ(this.props);
    }
    componentDidMount() {
        this.context.layer.setSource(this.source);
    }
}

ReactXYZ.propTypes = {
    url: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.string),
    tileSize: PropTypes.arrayOf(PropTypes.number)
}

ReactXYZ.contextTypes = {
    layer: PropTypes.instanceOf(BaseLayer)
}

export default ReactXYZ
