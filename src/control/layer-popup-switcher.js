// demo: http://viglino.github.io/ol-ext/examples/control/map.switcher.popup.html
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import LayerPopup from 'ol-ext/control/LayerPopup'
import OLControl from './ol-control'
import 'ol-ext/control/LayerPopup.css'

class OLExtLayerPopupSwitcher extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    };
    constructor(props) {
        super(props);
        this.control = new LayerPopup()
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default  connect(mapStateToProps)(OLExtLayerPopupSwitcher);
