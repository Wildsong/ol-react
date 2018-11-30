import React from 'react';
import PropTypes from 'prop-types';

import {Map} from 'ol';
import {Style} from 'ol/style';
import Tile from 'ol/layer/Tile';

import OLContainer from '../ol-container';

class ReactTile extends OLContainer {
  constructor (props) {
    super(props)
    this.layer = new Tile({
      visible: props.visible
    })
    this.layer.setZIndex(props.zIndex)
  }

  getChildContext () {
    return {
      layer: this.layer
    }
  }

  componentDidMount () {
    this.context.map.addLayer(this.layer)
  }

  componentWillReceiveProps (newProps) {
    this.layer.setVisible(newProps.visible)
    this.layer.setZIndex(newProps.zIndex)
  }

  componentWillUnmount () {
    this.context.map.removeLayer(this.layer)
  }
}

ReactTile.propTypes = {
  visible: PropTypes.bool,
  zIndex: PropTypes.number
}

ReactTile.defaultProps = {
  visible: true
}

ReactTile.contextTypes = {
  map: PropTypes.instanceOf(Map)
}

ReactTile.childContextTypes = {
  layer: PropTypes.instanceOf(Tile)
}

export default ReactTile;
