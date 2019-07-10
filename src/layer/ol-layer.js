import React from 'react'
import PropTypes from 'prop-types'
import { Map, Extent } from 'ol'
import { LayerContext } from '../layer-context'
import OLComponent from '../ol-component'
import { buildStyle } from '../style'

// These are properties that we want to use for sources
let dictSource = [

];

class OLLayer extends OLComponent {
    static propTypes = {
        map: PropTypes.instanceOf(Map).isRequired,
        title: PropTypes.string,
        opacity: PropTypes.number,
        visible: PropTypes.bool,
        extent: PropTypes.instanceOf(Extent),
        zIndex: PropTypes.number,
        minResolution: PropTypes.number,
        maxResolution: PropTypes.number,
        baseLayer: PropTypes.bool,
    }
    static defaultProps = {
        title: "unnamed layer",
        visible: true,
        baseLayer: false
    }

    constructor(props) {
        super(props)
        this.layer = null;

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
        try {
            this.props.map.addLayer(this.layer)
        } catch {
            console.log("addLayer failed")
        }
    }

    componentDidUpdate(prevProps) {
        //console.log("OLLayer.componentDidUpdate() state=", this.state, " previous=", prevProps, " this.props=", this.props);
        /*
        if (this.props.opacity !== prevProps.opacity) this.state.layer.setOpacity(this.props.opacity)
        if (this.props.visible !== prevProps.visible) this.state.layer.setVisible(this.props.visible)
        if (this.props.extent !== prevProps.extent) this.state.layer.setExtent(this.props.extent)
        if (this.props.zIndex !== prevProps.zIndex) this.state.layer.setZIndex(this.props.zIndex)
        if (this.props.minResolution !== prevProps.minResolution) this.state.layer.setMinResolution(this.props.minResolution)
        if (this.props.maxResolution !== prevProps.maxResolution) this.state.layer.setMaxResolution(this.props.maxResolution)
*/
        try {
            // This is currently tested in example2 with WMS services.
            if (this.props.url !== prevProps.url) {
                const source = this.layer.getSource();
                source.setUrl(this.props.url);
            }
        } catch {
        }

        let newProps = this.buildProps(this.dictLayer);
        this.layer.setProperties(newProps);
    }

    componentWillUnmount() {
        console.log("OLLayer.componentDidUnmount");
        this.props.map.removeLayer(this.layer)
    }

    render() {
        // Each layer passes itself and the parent map down to children.
        // The LayerContext is primarily for Vector layers, which can have Features as children.
        // Features need to know about Interactions, I think. And they hide in the map.
        return (
            <>
                <LayerContext.Provider value={{map: this.props.map, layer: this.layer}}>
                    {this.props.children}
                </LayerContext.Provider>
            </>
        );
    }
}
export default OLLayer;
