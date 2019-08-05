import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context'
import Extent from 'ol/extent'
import {Style} from 'ol/style'
import olVectorLayer from 'ol/layer/vector'

const Vector = (props) => {
    const map = useContext(MapContext);
    const title = props.title;
    const [layer, setLayer] = useState(new olVectorLayer(props));

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
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
    title: PropTypes.string.isRequired,

    opacity: PropTypes.number,
    visible: PropTypes.bool,
    extent: PropTypes.instanceOf(Extent),
    zIndex: PropTypes.number,

    declutter: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Style)]),
};
export default Vector;
