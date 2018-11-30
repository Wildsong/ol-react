import React from 'react';
import PropTypes from 'prop-types';

import {Map as olMap} from 'ol';
import {Style} from 'ol/style';
import {Tile as olTile} from 'ol/layer';

import OLContainer from '../ol-container';

export default class Tile extends OLContainer {
  constructor (props) {
    super(props)
    this.layer = new olTile({
      visible: this.props.visible
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

Tile.propTypes = {
  visible: PropTypes.bool,
  zIndex: PropTypes.number
}

Tile.defaultProps = {
  visible: true
}

Tile.contextTypes = {
  map: PropTypes.instanceOf(olMap)
}

Tile.childContextTypes = {
  layer: PropTypes.instanceOf(olTile)
}
