import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {DragBox as olDragBox} from 'ol/interaction'
import {Condition} from 'ol/events'

const DragBox = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [dragboxInteraction, setDragbox] = useState(() => {
        const interaction = new olDragBox({
            condition: props.condition
        });
        //use onBoxEnd instead?
        interaction.on("boxstart", props.boxstart);
        interaction.on("boxend", props.boxend);
        return interaction;
    });

    useEffect(() => {
        console.log("DragBox mounted", dragboxInteraction);
        map.addInteraction(dragboxInteraction);
        return () => {
            console.log("DragBox UNMOUNTED");
            map.removeInteraction(dragboxInteraction);
        }
    }, []);

    return null;
}

DragBox.propTypes = {
    //condition: PropTypes.instanceOf(Condition), // default is singleClick(), can be a func
    boxend: PropTypes.func,
    boxstart: PropTypes.func,
};
export default DragBox;
