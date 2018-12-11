import React from 'react';
import PropTypes from 'prop-types';
import MapContext from '../map-context';
import OLContainer from '../ol-container';
import {Extent} from 'ol';
import {Select} from 'ol/interaction';
import {click, pointerMove} from 'ol/events/condition';

class OLLayer extends OLContainer {
    constructor(props) {
        super(props)
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
        if (newProps.opacity !== undefined) this.layer.setOpacity(newProps.opacity)
        if (newProps.visible !== undefined) this.layer.setVisible(newProps.visible)
        if (newProps.extent !== undefined) this.layer.setExtent(newProps.extent)
        if (newProps.zIndex !== undefined) this.layer.setZIndex(newProps.zIndex)
        if (newProps.minResolution !== undefined) this.layer.setMinResolution(newProps.minResolution)
        if (newProps.maxResolution !== undefined) this.layer.setMaxResolution(newProps.maxResolution)
    }

    componentDidMount() {
        if (this.props.selectable) {
            let interactions = MapContext.map.getInteractions()
            this.selectInteraction = new Select({
                condition: click,
                layers: [this.layer],
            })
            this.selectInteraction.on('select', this.props.onSelect)
            interactions.push(this.selectInteraction);
        }
        if (this.props.hoverable) {
            let interactions = MapContext.map.getInteractions()
            this.hoverInteraction = new Select({
                condition: pointerMove,
                layers: [this.layer],
            })
            this.hoverInteraction.on('select', this.props.onHover)
            interactions.push(this.hoverInteraction);
        }
        MapContext.map.addLayer(this.layer)
    }

    componentWillUnmount() {
        let interactions = MapContext.map.getInteractions();
        if (this.selectInteraction) {
            interactions.remove(this.selectInteraction)
        }
        if (this.hoverInteraction) {
            interactions.remove(this.hoverInteraction)
        }
        MapContext.map.removeLayer(this.layer)
    }
}

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
