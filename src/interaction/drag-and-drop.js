import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
//import {Cluster} from 'ol/source'
import {Collection} from 'ol'
import {GPX, KML, EsriJSON, GeoJSON} from 'ol/format'
import {DragAndDrop as olDragAndDrop} from 'ol/interaction'

// TODO: inplement support for a drag and drop target outside the map.

const DragAndDrop = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [drag] = useState(() => {
        const interaction = new olDragAndDrop({
            source,
            features: props.features,
            projection: props.projection,
            formatConstructors: [GPX, KML, EsriJSON, GeoJSON]
        });
/*
        if (source instanceof Cluster) {
            source = source.source;
        }
*/
        interaction.on("addfeatures", () => {
            //source.addFeatures(evt.features); // Don't need to do this
            // FIXME: This should probably be an option
            // Zoom to extent of data
            map.getView().fit(source.getExtent());
        });
        return interaction;
    });

    useEffect(() => {
        map.addInteraction(drag);
        return () => {
            map.removeInteraction(drag);
       }
    }, [drag, map]);

    return null;
}
DragAndDrop.propTypes = {
    projection: PropTypes.string,
    features: PropTypes.instanceOf(Collection)
};
export default DragAndDrop;
