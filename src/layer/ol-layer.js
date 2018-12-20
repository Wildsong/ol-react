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

    buildLayerProps(props) {
        return {
            opacity: props.opacity,
            visible: props.visible,
            extent: props.extent,
            zIndex: props.zIndex,
            minResolution: props.minResolution,
            maxResolution: props.maxResolution,
        }
    }

    componentWillReceiveProps(newProps) {
        //console.log("OLLayer willreceiveprops context", this.context);
        if (newProps.opacity !== undefined) this.state.layer.setOpacity(newProps.opacity)
        if (newProps.visible !== undefined) this.state.layer.setVisible(newProps.visible)
        if (newProps.extent !== undefined) this.state.layer.setExtent(newProps.extent)
        if (newProps.zIndex !== undefined) this.state.layer.setZIndex(newProps.zIndex)
        if (newProps.minResolution !== undefined) this.state.layer.setMinResolution(newProps.minResolution)
        if (newProps.maxResolution !== undefined) this.state.layer.setMaxResolution(newProps.maxResolution)
    }

    componentDidMount() {
        console.log("OLLayer.componentDidMount context", this.context,  this);
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
            <LayerContext.Provider value={{layer: this.state.layer}}>
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
