import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
//import {SourceContext} from '../source-context'
import {DragBox as olDragBox} from 'ol/interaction'
import Condition from 'ol/events/condition'

const DragBox = (props) => {
    const map = useContext(MapContext);
    //const source = useContext(SourceContext);
    const [dragboxInteraction] = useState(() => {
        const interaction = new olDragBox({
            condition: props.condition
        });
        //use onBoxEnd instead?
        if (typeof props.boxstart !== 'undefined')
            interaction.on("boxstart", props.boxstart);
        if (typeof props.boxend !== 'undefined')
            interaction.on("boxend", props.boxend);
        return interaction;
    });

    useEffect(() => {
        map.addInteraction(dragboxInteraction);
        return () => {
            map.removeInteraction(dragboxInteraction);
        }
    }, [dragboxInteraction, map]);

    return null;
}

DragBox.propTypes = {
    condition: PropTypes.instanceOf(Condition), // default is singleClick(), can be a func
    boxend: PropTypes.func,
    boxstart: PropTypes.func,
};
export default DragBox;
