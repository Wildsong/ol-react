import React from 'react';
import PropTypes from 'prop-types';
import {Map, Feature} from 'ol';
import Polygon from 'ol/geom/Polygon';
import OLGeometry from './OLGeometry';

class OLPolygon extends OLGeometry {
    constructor(props) {
        super(props);
        this.geometry = new Polygon();
        this.updateFromProps(props);
    }

    updateFromProps(props) {
        this.geometry.setCoordinates([props.children]);
    }

    componentDidMount() {
        this.context.feature.setGeometry(this.geometry);
        if (this.props.editable) {
            let interactions = this.context.map.getInteractions()
            let polyInteraction = new ol.interaction.Modify({
                features: new ol.Collection([this.context.feature])
            })
            if (this.props.modifyEnd) {
                polyInteraction.on('modifyend', this.props.modifyEnd);
            }
            interactions.push(polyInteraction);
        }
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }

    render() {
        return false;
    }

    componentWillUnmount() {
        this.context.feature.setGeometry(undefined);
    }
}

// A polygon is an array of linear rings,
//  an optional layout,
// and optional ends
//
// A linear ring is a set of points and optional layout

OLPolygon.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired,
    editable: PropTypes.bool,
    modifyEnd: PropTypes.func
}

OLPolygon.contextTypes = {
    feature: PropTypes.instanceOf(Feature),
    map: PropTypes.instanceOf(Map)
}

export default OLPolygon;
