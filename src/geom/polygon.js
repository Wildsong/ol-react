import React, {useContext, useEffect} from 'react' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {FeatureContext} from '../feature-context'
import {Polygon as olPolygon} from 'ol/geom'

// A polygon is an array of linear rings,
// (remember, it's an array of array of arrays so put in extra []...)
//  an optional layout,
//  and optional ends
//
// A linear ring is a set of points and optional layout

// Simple example:
// <Polygon> { [ [[0,0], [1,1], [1,0], [0,0]] ] </Polygon>}

const Polygon = (props) => {
    const feature = useContext(FeatureContext);
    const geometry = new olPolygon(props.children);

    useEffect(() => {
        if (props.transform)
            geometry.applyTransform(props.transform);
        feature.setGeometry(geometry);
        //console.log("polygon mounted");
        //return () => {console.log("polygon unmounted")};
    },[feature, geometry, props.transform]);
    return null; // nothing to render here
}
Polygon.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.number)
        )
    ).isRequired,
    editable: PropTypes.bool,
    modifyEnd: PropTypes.func
}
export default Polygon;
