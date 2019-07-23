// demo: http://viglino.github.io/ol-ext/examples/control/map.switcher.popup.html
import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olextLayerPopup from 'ol-ext/control/LayerPopup'
import 'ol-ext/control/LayerPopup.css'

const LayerPopup = (props) => {
    const map = useContext(MapContext)
    const [popup, setControl] = useState(new olextLayerPopup());
    useEffect(() => {
        map.addControl(control);
        return () => { map.removeControl(control); }
    }, []);
    return null;
}
export default LayerPopup;
