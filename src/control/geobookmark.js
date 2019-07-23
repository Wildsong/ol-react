import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types';
import {MapContext} from '../map-context'
import olextGeoBookmark from 'ol-ext/control/GeoBookmark'
import 'ol-ext/control/GeoBookmark.css'

const GeoBookmarkControl = (props) => {
    const map = useContext(MapContext);
    const [control, setControl] = useState(new olextGeoBookmark(props));
    useEffect(() => {
        map.addControl(control);
        return () => { map.removeControl(control); }
    }, []);
    return null;
}
GeoBookmarkControl.propTypes = {
    marks: PropTypes.object,
}
export default GeoBookmarkControl;
