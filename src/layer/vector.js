import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'ol';
import {Style} from 'ol/style';
import Vector from 'ol/layer/Vector';
import OLLayer from './OLLayer';
import {buildLayerProps, baseLayerPropTypes} from './';
import {buildStyle} from '../style';

class OLVector extends OLLayer {
    constructor(props) {
        super(props);

        let layerProps = this.buildLayerProps(props);

        this.layer = new Vector({
            ...layerProps,
            style: buildStyle(props.style),
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
        super.componentWillReceiveProps(newProps);
        this.layer.setStyle(buildStyle(newProps.style));
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        this.context.map.removeLayer(this.layer)
    }
}

OLVector.propTypes = {
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

OLVector.contextTypes = {
  map: PropTypes.instanceOf(Map)
}

OLVector.childContextTypes = {
  layer: PropTypes.instanceOf(Vector),
  map: PropTypes.instanceOf(Map)
}

export default OLVector
