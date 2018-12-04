import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Style} from 'ol/style';
import {Image} from 'ol/layer';
import OLLayer from './OLLayer';

class ReactImage extends OLLayer {
    constructor(props) {
        super(props)
        let layerProps = this.buildLayerProps(props);
        this.layer = new Image({
            ...layerProps,
        })
    }

    getChildContext() {
        return {
            layer: this.layer
        }
    }

    componentDidMount() {
        this.context.map.addLayer(this.layer)
    }

    componentWillReceiveProps(newProps) {
        this.layer.setVisible(newProps.visible)
        this.layer.setZIndex(newProps.zIndex)
    }

    componentWillUnmount() {
        this.context.map.removeLayer(this.layer)
    }
}

ReactImage.propTypes = {

}

ReactImage.defaultProps = {
    visible: true
}

ReactImage.contextTypes = {
    map: PropTypes.instanceOf(Map)
}

ReactImage.childContextTypes = {
    layer: PropTypes.instanceOf(Image)
}

export default ReactImage
