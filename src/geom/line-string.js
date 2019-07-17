import React from 'react'
import PropTypes from 'prop-types'
import {Feature} from 'ol'
import {LineString as olLineString} from 'ol/geom'
import {FeatureContext} from '../feature-context'

// A linestring is an array of points and an optional layout.

const LineString = (props) => {
    const feature = useContext(FeatureContext)

    useEffect(() => {
        const geometry = new olLineString(props.children, "XY");
        feature.setGeometry(geometry);
        geometry.applyTransform(props.transform);
        console.log("feature added");
        return () => {console.log("feature unmounted")};
    });

    return null; // nothing to render here
}
LineString.propTypes = {
    transform: PropTypes.func,
    children: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired
}
