import React from 'react'
import PropTypes from 'prop-types'
import { MapContext } from '../map-context'
import { LayerContext } from '../layer-context'
import OLComponent from '../ol-component'
import { Extent } from 'ol'
import { Select } from 'ol/interaction'
import { click, pointerMove } from 'ol/events/condition'
import { buildStyle } from '../style'

// These are properties that we want to use for sources
let dictSource = [

];

export default class OLLayer extends OLComponent {
    static contextType = MapContext;

    static propTypes = {
        name: PropTypes.string,
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
    static defaultProps = {
        visible: true,
        selectable: false,
        hoverable: false
    }

    state = {
        layer: null
    };

    constructor(props) {
        super(props)

        this.layerName = this.props.name;

        // These options are accepted by any layer
        // http://openlayers.org/en/latest/apidoc/module-ol_layer_Base.html#~Options
        this.dictLayer = [
            "opacity",
            "visible",
            "extent",
            "zIndex",
            "minResolution",
            "maxResolution",
        ];

        // These options are attributes accepted by any source
        // See http://openlayers.org/en/latest/apidoc/module-ol_source_Source-Source.html
        this.dictSource = [
            'attributions',
            'attributionsCollapsible',
            'projection',
            'state',
            'wrapX',
            'editStyle'
        ]

    }

    buildProps(dict) {
        // dict is a set of acceptable attributes
        // if a property is in this set, copy it to the returned set
        // the new set will then be passed to an openlayers constructor
        let rProps = {};
        for (let k in this.props) {
            // If you have problems with map source or layer props
            // try commenting out the next line, too many props are passed but
            // it's usually not harmful. 'source' is bad :-)
            if (dict.indexOf(k) >= 0)
            //if (k !== 'source') // defining 'source breaks XYZ!!
                rProps[k] = this.props[k]
        }
        //console.log("build props", this.props, "=>", rProps);
        return rProps;
    }

    componentDidMount() {
        // We're adding this now that the layer has been added to the map
        let select;
        let interactions = this.context.map.getInteractions()
        if (this.props.selectable) {
            //let editStyle = buildStyle(this.props.editStyle);
            select = new Select({
                //condition: click,
                layers: [this.state.layer],
                //style: editStyle
                // features: collection
                // filter: func
                // hitTolerance:0
            })
            select.on('select', this.props.onSelect)
            interactions.push(select);
            this.selectInteraction = select;
        }
        if (this.props.hoverable) {
            this.hoverInteraction = new Select({
                condition: pointerMove,
                layers: [this.state.layer],
            })
            this.hoverInteraction.on('select', this.props.onHover)
            interactions.push(this.hoverInteraction);
        }
        try {
            this.context.map.addLayer(this.state.layer)
        } catch {
            console.log("Ugh")
        }
    }

    componentDidUpdate(prevProps) {
        //console.log("layer.OLLayer.componentDidUpdate() state=", this.state, " previous=", prevProps, " this.props=", this.props);
        /*
        if (this.props.opacity !== prevProps.opacity) this.state.layer.setOpacity(this.props.opacity)
        if (this.props.visible !== prevProps.visible) this.state.layer.setVisible(this.props.visible)
        if (this.props.extent !== prevProps.extent) this.state.layer.setExtent(this.props.extent)
        if (this.props.zIndex !== prevProps.zIndex) this.state.layer.setZIndex(this.props.zIndex)
        if (this.props.minResolution !== prevProps.minResolution) this.state.layer.setMinResolution(this.props.minResolution)
        if (this.props.maxResolution !== prevProps.maxResolution) this.state.layer.setMaxResolution(this.props.maxResolution)
*/
        let newProps = this.buildProps(this.dictLayer);
        this.state.layer.setProperties(newProps);
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
        return (
            <div>
            <LayerContext.Provider value={{
                map  : this.context.map,
                layer: this.state.layer
            }}>
                {this.props.children}
            </LayerContext.Provider>
            </div>
        );
    }
}
