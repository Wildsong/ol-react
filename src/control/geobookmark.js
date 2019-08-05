import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types';
import {MapContext} from '../map-context'
import olextGeoBookmark from 'ol-ext/control/GeoBookmark'
import 'ol-ext/control/GeoBookmark.css'

/*
marks: {
  "Paris": {pos:_ol_proj_.transform([2.351828, 48.856578], 'EPSG:4326', 'EPSG:3857'), zoom:11, permanent: true },
  "London": {pos:_ol_proj_.transform([-0.1275,51.507222], 'EPSG:4326', 'EPSG:3857'), zoom:12}
}
*/

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
    editable: PropTypes.bool
}
export default GeoBookmarkControl;
