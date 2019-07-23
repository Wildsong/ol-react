// See full docs at
// http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html

import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olSearchNominatim from 'ol-ext/control/SearchNominatim'

// Comes up in the wrong place, hence it needs styling.
//  This is the search widget that comes up on the map.
// Needs suport for target prop

const SearchNominatim = (props) => {
    const map = useContext(MapContext);
    const [control, setControl] = useState(new olSearchNominatim());
    useEffect(() => {
        console.log("SearchNominatim mounted");
        map.addControl(control);
        search.on('select', props.onGeocode);
        return () => {
            map.removeControl(control);
            console.log("SearchNominatim UNMOUNTED");
        }
    }, []);
    return null;
}
SearchNominatim.propTypes = {
    polygon: PropTypes.bool, // include geojson geometry in output
};
export default SearchNominatim;
