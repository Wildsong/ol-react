import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LineString as olLineString} from 'ol/geom'
import {FeatureContext} from '../feature-context'

// A linestring is an array of points and an optional layout.

const LineString = (props) => {
    const feature = useContext(FeatureContext);
    const geometry = new olLineString(props.children, 'XY');
    useEffect(() => {
        if (props.transform)
            geometry.applyTransform(props.transform);
        feature.setGeometry(geometry);
        //console.log("lineString mounted");
        //return () => {console.log("lineString unmounted")};
    },[]);
    return null; // nothing to render here
}
LineString.propTypes = {
    transform: PropTypes.func,
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired
}
export default LineString;
