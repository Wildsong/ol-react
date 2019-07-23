import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {DragBox as olDragBox} from 'ol/interaction'

const DragBox = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [dragbox, setDragbox] = useState(() => {
        console.log("DragBox", props);
        const interaction = new olDragBox(props);
/*
use onBoxEnd instead?
        interaction.addEventListener("boxend",
    	    (evt) => {
                if (typeof props.drawend !== 'undefined') {
                    console.log("boxend", evt);
                    props.drawend(evt);
                }
    	    }
    	);
        */
        return interaction;
    });

    useEffect(() => {
        console.log("DragBox mounted");
        //map.addInteraction(DragBox);
        return () => {
            console.log("DragBox UNMOUNTED");
            //map.removeInteraction(DragBox);
        }
    }, []);

    return null;
}

DragBox.propTypes = {
    active: PropTypes.bool,
    boxdrag: PropTypes.func,
    onBoxEnd: PropTypes.func,
    boxend: PropTypes.func,
    boxstart: PropTypes.func,
    className: PropTypes.string,
    condition: PropTypes.func
};
export default DragBox;
