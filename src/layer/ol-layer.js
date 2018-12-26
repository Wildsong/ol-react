import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerContext} from '../layer-context'
import OLComponent from '../ol-component'
import {Extent} from 'ol'
import {Select} from 'ol/interaction'
import {click, pointerMove} from 'ol/events/condition'

class OLLayer extends OLComponent {
    constructor(props) {
        super(props)
        //console.log("OLLayer new() props=", props)
        this.state = {
            layer: null
        };
    }

    buildLayerProps() {
        return {
            opacity: this.props.opacity,
            visible: this.props.visible,
            extent: this.props.extent,
            zIndex: this.props.zIndex,
            minResolution: this.props.minResolution,
            maxResolution: this.props.maxResolution,
        }
    }

    componentDidMount() {
        //console.log("OLLayer.componentDidMount() context=", this.context);
        if (this.props.selectable) {
            let interactions = this.context.map.getInteractions()
            this.selectInteraction = new Select({
                condition: click,
                layers: [this.state.layer],
            })
            this.selectInteraction.on('select', this.props.onSelect)
            interactions.push(this.selectInteraction);
        }
        if (this.props.hoverable) {
            let interactions = this.context.map.getInteractions()
            this.hoverInteraction = new Select({
                condition: pointerMove,
                layers: [this.state.layer],
            })
            this.hoverInteraction.on('select', this.props.onHover)
            interactions.push(this.hoverInteraction);
        }
        this.context.map.addLayer(this.state.layer)
    }

    componentDidUpdate(prevProps) {
        // I wonder about using this.state.layer.setProperties here?
        // It's so easy it feels like cheating.
//      console.log("layer.OLLayer.componentDidUpdate() ",prevProps, " this.props=",this.props);
/*
        if (this.props.opacity !== prevProps.opacity) this.state.layer.setOpacity(this.props.opacity)
        if (this.props.visible !== prevProps.visible) this.state.layer.setVisible(this.props.visible)
        if (this.props.extent !== prevProps.extent) this.state.layer.setExtent(this.props.extent)
        if (this.props.zIndex !== prevProps.zIndex) this.state.layer.setZIndex(this.props.zIndex)
        if (this.props.minResolution !== prevProps.minResolution) this.state.layer.setMinResolution(this.props.minResolution)
        if (this.props.maxResolution !== prevProps.maxResolution) this.state.layer.setMaxResolution(this.props.maxResolution)
*/
        this.state.layer.setProperties(this.props);
    }

    componentWillUnmount() {
        let interactions = this.context.map.getInteractions();
        if (this.selectInteraction) {
            interactions.remove(this.selectInteraction)
        }
        if (this.hoverInteraction) {
            interactions.remove(this.hoverInteraction)
        }
        this.context.map.removeLayer(this.state.layer)
    }

    render() {
        //console.log("OLLayer.render props=", this.props.children);
        return (
            <div>
            <LayerContext.Provider value={{
                map  : this.context.map,
                layer: this.state.layer,
            }}>
                {this.props.children}
            </LayerContext.Provider>
            </div>
        );
    }
}

OLLayer.contextType = MapContext;

OLLayer.PropTypes = {
    opacity: PropTypes.number,
    visible: PropTypes.bool,
    extent: PropTypes.instanceOf(Extent),
    zIndex: PropTypes.number,
    minResolution: PropTypes.number,
    maxResolution: PropTypes.number,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    hoverable: PropTypes.bool,
    onHover: PropTypes.func
}

OLLayer.defaultProps = {
    visible: true,
    selectable: false
}

export default OLLayer
