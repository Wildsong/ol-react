import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Map} from 'ol'
import {toLatLon} from 'ol/proj'
import {defaults as defaultInteractions} from 'ol/interaction'
import {defaults as defaultControls} from 'ol/control'
import OLComponent from './ol-component'

class OLMap extends Component {
    static propTypes = {
        map: PropTypes.object.isRequired,
        loadTilesWhileAnimating: PropTypes.bool,
        loadTilesWhileInteracting: PropTypes.bool,
        onPointerMove: PropTypes.func,
        onClick: PropTypes.func,
        onSingleClick: PropTypes.func,
        onChangeSize: PropTypes.func,
        onMoveEnd: PropTypes.func,
        onPostrender: PropTypes.func,
        focusOnMount: PropTypes.bool.isRequired,
/*        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.element),
            PropTypes.element,
        ])
*/    }
    static defaultProps = {
        focusOnMount: false
    }

    constructor(props) {
        super(props);
        /*
        this.props.map = new Map({
            loadTilesWhileAnimating: this.props.loadTilesWhileAnimating,
            loadTilesWhileInteracting: this.props.loadTilesWhileInteracting,
            interactions: this.props.useDefaultInteractions ? defaultInteractions() : [],
            controls: this.props.useDefaultControls ? defaultControls() : [],
            overlays: []
        });
        */
        if (this.props.onPointerMove) this.props.map.on('pointermove', this.props.onPointerMove, this);
        //if (this.props.onPointerDrag) this.props.map.on('pointerdrag', this.props.onPointeDrag, this);

        // There are about 20 different events we could watch here
        // see https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/events/EventType.js
        if (this.props.onChangeSize)  this.props.map.on('change:size', this.props.onChangeSize);
        if (this.props.onClick)       this.props.map.on('click', this.props.onClick);
        if (this.props.onSingleClick) this.props.map.on('singleclick', this.props.onSingleClick);
        //if (this.props.onDblClick)    this.props.map.on('doubleclick', this.props.onDblClick);
        if (this.props.onMoveEnd)     this.props.map.on('moveend', this.props.onMoveEnd);
        if (this.props.onPostrender)  this.props.map.on('postrender', this.props.onPostrender);

        this.setMapTarget = element => {
            console.log("setMapTarget");
            this.props.map.setTarget(element)
        }
    }

    focus() {
        const viewport = this.props.map.getViewport()
        viewport.tabIndex = 0
        viewport.focus()
    }

    updateSize() {
        this.props.map.updateSize()
    }

    getSize() {
        return this.props.map.getSize();
    }

    componentDidMount() {
        if (this.props.focusOnMount) {
            this.focus()
        }
    }

    componentWillUnmount() {
        this.props.map.setTarget(undefined)
    }

    render() {
        //console.log("OLMap.render() props=", this.props)
        return (
            <div style={this.props.style}>
            <>
                {this.props.children}
                {this.props.view}
            </>
            <div ref={this.setMapTarget} className='ol-react-map'></div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
});
export default connect(mapStateToProps)(OLMap)
