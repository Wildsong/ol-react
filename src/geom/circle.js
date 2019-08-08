import React, {useContext, useEffect} from 'react' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {Circle as olCircle} from 'ol/geom'
import {FeatureContext} from '../feature-context'

// A linestring is an array of points and an optional layout.

const Circle = ({transform, children}) => {
    const feature = useContext(FeatureContext);
    let geometry;
    let center = children[0];
    if (typeof center === 'number') {
        // center only
        center = children;
        geometry = new olCircle(center);
    } else {
        const radius = children[1];
        geometry = new olCircle(center, radius);
    }
    useEffect(() => {
        if (transform)
            geometry.applyTransform(transform);
        feature.setGeometry(geometry);
        //console.log("lineString mounted");
        //return () => {console.log("lineString unmounted")};
    }, [feature, geometry, transform]);
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
