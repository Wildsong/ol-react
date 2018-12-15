import React from 'react';
import PropTypes from 'prop-types';
import LayerContext from './layer-context';
import FeatureContext from './feature-context';
import {Source} from 'ol/source';
import {Feature} from 'ol';
import OLComponent from './ol-component';
import {buildStyle} from './style';

class OLFeature extends OLComponent {
    constructor(props) {
        super(props);
        this.feature = new Feature({});
        this.feature.setId(props.id);
        console.log("OLFeature =", this.feature)
        FeatureContext.feature = this.feature;
        this.updateFromProps(props);
    }

    updateFromProps(props) {
        this.feature.setStyle(buildStyle(props.style));
    }

    componentDidMount() {
        console.log("OLFeature did mount. source=", LayerContext.source)
        LayerContext.source.addFeature(this.feature);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }

    componentWillUnmount() {
        LayerContext.source.removeFeature(this.feature);
    }

    getGeometry() {
        return this.feature.getGeometry();
    }
}

OLFeature.propTypes = {
    style: PropTypes.object,
    children: PropTypes.element,
    id: PropTypes.any.isRequired
}

export default OLFeature
