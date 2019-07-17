import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Circle as olCircle} from 'ol/geom'
import {FeatureContext} from '../feature-context'

// A linestring is an array of points and an optional layout.

const Circle = (props) => {
    const feature = useContext(FeatureContext);
    let geometry;
    let center = props.children[0];
    if (typeof center === 'number') {
        // center only
        center = props.children;
        geometry = new olCircle(center);
    } else {
        const radius = props.children[1];
        geometry = new olCircle(center, radius);
    }
    useEffect(() => {
        if (props.transform)
            geometry.applyTransform(props.transform);
        feature.setGeometry(geometry);
        //console.log("lineString mounted");
        //return () => {console.log("lineString unmounted")};
    },[]);
    return null; // nothing to render here
}
Circle.propTypes = {
    transform: PropTypes.func,
    modify: PropTypes.bool,
//    children: PropTypes.arrayOf(
//        PropTypes.arrayOf(PropTypes.number)
//    ).isRequired
}
export default Circle;

// Circle requires a center x,y point
//   optionally radius (default 0)
//   and layout (default XY, I hope!)  UNSUPPORTED
//
//  <Circle>{[[x,y], radius]}</Circle>
//  <Circle>{[x,y]}</Circle>
