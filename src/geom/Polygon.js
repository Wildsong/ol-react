import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Polygon from 'ol/geom/Polygon';
import OLGeometry from './OLGeometry';

// I'm not seeing why polygons don't show up...
// I tried to make the code look like the line-string code which is about the same
// and it works

class OLPolygon extends OLGeometry {
    constructor(props) {
        super(props);
        console.log('debug polygon:', props.children);
        this.geometry = new Polygon(props.children);
    }

    componentDidMount() {
        console.log("componentDidMount polygon")
        /*
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
        */
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
//    map: PropTypes.instanceOf(Map)
}

export default OLPolygon;
