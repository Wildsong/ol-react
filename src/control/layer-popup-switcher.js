// demo: http://viglino.github.io/ol-ext/examples/control/map.switcher.popup.html

import React from 'react'
import PropTypes from 'prop-types'
import OLComponent from '../ol-component';
import LayerPopup from 'ol-ext/control/LayerPopup'
import 'ol-ext/control/LayerPopup.css'

class OLExtLayerPopupSwitcher extends OLComponent {
    constructor(props) {
        super(props);
        this.layerSwitcherControl = new LayerPopup()
        return this.layerSwitcherControl;
    }
}
export default OLExtLayerPopupSwitcher;
