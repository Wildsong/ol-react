import React, {useContext, useEffect} from 'react' // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LineString as olLineString} from 'ol/geom'
import {FeatureContext} from '../feature-context'

// A linestring is an array of points and an optional layout.

const LineString = ({transform, children}) => {
    const feature = useContext(FeatureContext);
    const geometry = new olLineString(children, 'XY');
    useEffect(() => {
        if (transform)
            geometry.applyTransform(transform);
        feature.setGeometry(geometry);
        //console.log("lineString mounted");
        //return () => {console.log("lineString unmounted")};
    }, [feature, geometry, transform]);
    return null; // nothing to render here
}
LineString.propTypes = {
    transform: PropTypes.func,
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired
}
export default LineString;
