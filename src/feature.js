import React from 'react';
import PropTypes from 'prop-types';
import {Source} from 'ol/source';
import {Feature} from 'ol';
import OLComponent from './ol-component';
import { buildStyle } from './style';

class OLFeature extends OLComponent {
    constructor(props) {
        super(props);
        console.log("feature props=", props);
        this.feature = new Feature({});
        this.feature.setId(props.id);
        this.updateFromProps(props);
    }

    updateFromProps(props) {
        this.feature.setStyle(buildStyle(props.style));
    }

    getChildContext() {
        return {
            feature: this.feature
        }
    }

    componentDidMount() {
        this.context.source.addFeature(this.feature);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }

    componentWillUnmount() {
        this.context.source.removeFeature(this.feature);
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

OLFeature.contextTypes = {
    source: PropTypes.instanceOf(Source)
}

OLFeature.childContextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLFeature
