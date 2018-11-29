import {Component} from 'react';
import PropTypes from 'prop-types';
import ol from 'openlayers';
import OLComponent from './ol-component';

export default class Map extends Component {
  constructor (props) {
    super(props)
    this.map = new ol.Map({
      loadTilesWhileAnimating: props.loadTilesWhileAnimating,
      loadTilesWhileInteracting: props.loadTilesWhileInteracting,
      interactions: props.useDefaultInteractions ? ol.interaction.defaults() : [],
      controls: props.useDefaultControls ? ol.control.defaults() : []
    })

    if (props.onChangeSize) {
      this.map.on('change:size', props.onChangeSize);
    }
    if (this.props.onSingleClick) {
      this.map.on('singleclick', this.props.onSingleClick);
    }
  }

  componentDidMount () {
    this.map.setTarget(this.refs.target)

    if (this.props.focusOnMount) {
      this.focus()
    }
  }

  componentWillUnmount () {
    this.map.setTarget(undefined)
  }

  getChildContext () {
    return {
      map: this.map
    }
  }

  render () {
    return (
      <div style={this.props.style}>
        <div ref="target">
        </div>
        <div>
          {this.props.children}
          {this.props.view}
        </div>
      </div>
    )
  }

  focus () {
    const viewport = this.map.getViewport()
    viewport.tabIndex = 0
    viewport.focus()
  }
}

Map.propTypes = {
  loadTilesWhileAnimating: PropTypes.bool,
  loadTilesWhileInteracting: PropTypes.bool,
  onSingleClick: PropTypes.func,
  onChangeSize: PropTypes.func,
  view: PropTypes.element.isRequired,
  useDefaultInteractions: PropTypes.bool.isRequired,
  useDefaultControls: PropTypes.bool.isRequired,
  focusOnMount: PropTypes.bool.isRequired,

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ])
}

Map.defaultProps = {
  useDefaultInteractions: true,
  useDefaultControls: true,
  focusOnMount: false
}

Map.childContextTypes = {
  map: PropTypes.instanceOf(ol.Map)
}
