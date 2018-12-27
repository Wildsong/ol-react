import React from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Image} from 'ol/layer'
import OLLayer from './ol-layer'

export default class OLImage extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps();
        this.state.layer = new Image({
            ...layerProps,
        })
    }

    componentDidUpdate(prevProps) {
        console.log("OLImage.componentDidUpdate()", this.props);
        this.state.layer.setVisible(this.props.visible)
        this.state.layer.setZIndex(this.props.zIndex)
    }
}

OLImage.propTypes = {
}

OLImage.defaultProps = {
    visible: true
}
