import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
//import {Cluster} from 'ol/source'
import {Collection} from 'ol'
import {GPX, KML, EsriJSON, GeoJSON} from 'ol/format'
import {DragAndDrop as olDragAndDrop} from 'ol/interaction'

// TODO: implement support for a drag and drop target outside the map.

const DragAndDrop = ({projection, fit}) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [drag] = useState(() => {
        const interaction = new olDragAndDrop({
            formatConstructors: [GPX, KML, EsriJSON, GeoJSON],
            //source, // with this, I will replace old features with new ones
            projection,
            //target
        });
/*
        if (source instanceof Cluster) {
            source = source.source;
        }
*/
        // with this, I will add more features to an existing set on subsequent drops
        interaction.on("addfeatures", (evt) => {
            //console.log("DragAndDrop \"addfeatures\" events", evt.features, " to", source);
            source.addFeatures(evt.features);
            if (fit && source.getFeatures().length > 0) { // Zoom to extent of all data
                map.getView().fit(source.getExtent());
            }
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
    fit: PropTypes.bool
};
export default DragAndDrop;
