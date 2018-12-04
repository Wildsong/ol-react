import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Style} from 'ol/style';
import {Vector as olVector} from 'ol/layer';
import OLLayer from './OLLayer';
import {buildStyle} from '../style';

class ReactVector extends OLContainer {
    constructor(props) {
        super(props)
        let layerProps = this.buildLayerProps(props);
        this.layer = new olVector({
            updateWhileAnimating: props.updateWhileAnimating,
            updateWhileInteracting: props.updateWhileInteracting,
        })
    }

    getChildContext() {
        return {
          layer: this.layer,
          map: this.context.map
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.map.addLayer(this.layer)
    }

    componentWillReceiveProps(newProps) {
        this.layer.setStyle(buildStyle(newProps.style));
        this.layer.setVisible(newProps.visible)
        this.layer.setZIndex(newProps.zIndex)
    }

    componentWillUnmount () {
        this.context.map.removeLayer(this.layer)
    }
}

ReactVector.propTypes = {
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
    style: PropTypes.oneOfType([
        PropTypes.instanceOf(Style),
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.oneOfType([
          PropTypes.instanceOf(Style),
          PropTypes.object
        ]))
    ])
}

ReactVector.contextTypes = {
  map: PropTypes.instanceOf(Map)
}

ReactVector.childContextTypes = {
  layer: PropTypes.instanceOf(olVector),
  map: PropTypes.instanceOf(Map)
}

export default ReactVector
