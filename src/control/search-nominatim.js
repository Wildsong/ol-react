// See full docs at
// http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html

import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olSearchNominatim from 'ol-ext/control/SearchNominatim'

// This is the search widget that comes up on the map.
// Needs suport for target prop to make it come up elsewhere

const SearchNominatim = ({polygon, viewbox, bounded, onGeocode}) => {
    const map = useContext(MapContext);

    // http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html
    // https://nominatim.org/release-docs/develop/api/Search/

    const [control] = useState(() => {
        return new olSearchNominatim({
                polygon,
                viewbox : (viewbox === undefined)? null : viewbox.toString(),
                bounded : (bounded !== undefined && bounded)? 1 : 0,
            })
        });

    useEffect(() => {
        map.addControl(control);
        control.on('select', onGeocode);
        return () => {
            map.removeControl(control);
        }
    }, []);

    return null;
}
SearchNominatim.propTypes = {
    polygon: PropTypes.bool, // include geojson geometry in output
    viewbox: PropTypes.arrayOf(PropTypes.number), // bias search results based on this bbox.
    bounded: PropTypes.bool, // restrict to viewbox if true
};
export default SearchNominatim;
