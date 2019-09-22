import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
//import {SourceContext} from '../source-context'
import {DragOverlay as olDragOverlay} from 'ol/interaction'
import Condition from 'ol/events/condition'

// Create an Overlay, Overlay.Popup, or Overlay.Placemark and
// then put markers in the Overlay
// and use this interaction to DragOverlay the markers around.

const DragOverlay = (props) => {
    const map = useContext(MapContext);
    //const source = useContext(SourceContext);
    const [dragOverlayInteraction] = useState(() => {
        const interaction = new olDragOverlay({
            condition: props.condition
        });
        //use onBoxEnd instead?
        if (props.dragstart !== undefined)
            interaction.on("dragstart", props.dragstart);
        if (props.boxend !== undefined)
            interaction.on("dragend", props.dragend);
        return interaction;
    });

    useEffect(() => {
        map.addInteraction(dragOverlayInteraction);
        return () => {
            map.removeInteraction(dragOverlayInteraction);
        }
    }, [dragOverlayInteraction, map]);

    return null;
}

DragOverlay.propTypes = {
    condition: PropTypes.instanceOf(Condition), // default is singleClick(), can be a func
    dragstart: PropTypes.func,
    dragend: PropTypes.func,
};
export default DragOverlay;
