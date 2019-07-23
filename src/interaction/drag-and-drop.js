import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Cluster} from 'ol/source'
import {Collection} from 'ol'
import {GPX, KML, EsriJSON, GeoJSON} from 'ol/format'
import {DragAndDrop as olDragAndDrop, DragAndDropEvent as olDragAndDropEvent} from 'ol/interaction'

// TODO: inplement support for a drag and drop target outside the map.

const DragAndDrop = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [drag, setDrag] = useState(() => {
        console.log("DragAndDrop", props);
        const interaction = new olDragAndDrop({
            source,
            features: props.features,
            projection: props.projection,
            formatConstructors: [GPX, KML, EsriJSON, GeoJSON]
        });
        if (source instanceof Cluster) {
            source = source.source;
        }
        interaction.on("addfeatures", (evt) => {
            console.log("DragAndDrop.addfeatures", evt.features.length, source)
            //source.addFeatures(evt.features); // Don't need to do this
            // FIXME: This should probably be an option
            // Zoom to extent of data
            map.getView().fit(source.getExtent());
        });
        return interaction;
    });

    useEffect(() => {
        console.log("DragAndDrop mounted");
        map.addInteraction(drag);
        return () => {
            console.log("DragAndDrop UNMOUNTED");
            map.removeInteraction(drag);
        }
    }, []);

    return null;
}
DragAndDrop.propTypes = {
    projection: PropTypes.string,
    features: PropTypes.instanceOf(Collection)
};
export default DragAndDrop;
