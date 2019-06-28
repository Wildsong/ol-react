// demo: http://viglino.github.io/ol-ext/examples/control/map.switcher.popup.html

import React from 'react'
import PropTypes from 'prop-types'
import OLControl from './ol-control'
import LayerPopup from 'ol-ext/control/LayerPopup'
import 'ol-ext/control/LayerPopup.css'

export default class OLExtLayerPopupSwitcher extends OLControl {
//    static propTypes = Object.assign({}, OLControl.propTypes, {
//    	className: PropTypes.string,
//    })
//    static defaultProps = {
//    }

    createControl(props) {
        this.layerSwitcherControl = new LayerPopup()
        return this.layerSwitcherControl;
    }

    //render() {
    //    //console.log("OLZoom render ", this.props);
    //    return super.render();
    //}
}
