// See full docs at
// http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html

import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olSearchNominatim from 'ol-ext/control/SearchNominatim'

// This is the search widget that comes up on the map.
// Needs suport for target prop to make it come up elsewhere

const SearchNominatim = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olSearchNominatim());
    useEffect(() => {
        map.addControl(control);
        control.on('select', props.onGeocode);
        return () => {
            map.removeControl(control);
        }
    }, []);

    return null;
}
SearchNominatim.propTypes = {
    polygon: PropTypes.bool, // include geojson geometry in output
};
export default SearchNominatim;
