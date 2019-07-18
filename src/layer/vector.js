import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'
import {Style as olStyle} from 'ol/style'
import {Vector as olVectorLayer} from 'ol/layer'
import {buildStyle} from '../style'

const Vector = (props) => {
    const map = useContext(MapContext);
    const title = props.title;
    const [layer, layerState] = useState(new olVectorLayer({
        style: olstyle,
        opacity: props.opacity
    }));
    const olstyle = buildStyle(props.style)
    console.log('layer.Vector', title);

    useEffect(() => {
        console.log("layer.Vector mounted", title);
        map.addLayer(layer);
        return () => {
            console.log("layer.Vector unmounted", title);
            map.removeLayer(layer);
        }
    }, []);

    useEffect(() => {
        layer.setOpacity((typeof props.opacity === "undefined")? 1.0 : props.opacity);
        //console.log("layer.Vector opacity set to", layer.getOpacity());
    }, [props.opacity]);

    useEffect(() => {
        layer.setVisible((typeof props.visible === "undefined")? true : props.visible);
        //console.log("layer.Vector visible set to", layer.getVisible());
    }, [props.visible]);

    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Vector.propTypes = {
    title: PropTypes.string.isRequired,
    declutter: PropTypes.bool,
    /*
//    source: PropTypes.object, // directly pass in an Openlayers object OR use a child
    style:  PropTypes.oneOfType([
        PropTypes.instanceOf(olStyle),
        PropTypes.object,
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.instanceOf(olStyle),
            PropTypes.object
        ]))
    ]),
    editStyle:  PropTypes.oneOfType([
        PropTypes.instanceOf(olStyle),
        PropTypes.object,
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.instanceOf(olStyle),
            PropTypes.object
        ]))
    ]),
    cluster: PropTypes.bool,
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
    */
};
export default Vector;
