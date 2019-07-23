import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Draw as olDraw} from 'ol/interaction'

const Draw = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    //const olEvents = ["drawend", "drawstart"];
    const [draw, setDraw] = useState(() => {
        console.log("Draw", props);
        const interaction = new olDraw({
            type: props.type,
            source
        });
        interaction.addEventListener("drawend",
    	    (evt) => {
                if (typeof props.drawend !== 'undefined') {
                    console.log("drawend", evt);
                    props.drawend(evt);
                }
    	    }
    	);
        return interaction;
    });

    useEffect(() => {
        console.log("Draw mounted");
        map.addInteraction(draw);
        return () => {
            console.log("Draw UNMOUNTED");
            map.removeInteraction(draw);
        }
    }, []);

    useEffect(() => {
        console.log("Draw type changed", draw, props);
        draw.setProperties({type:props.type});
    }, [props.type]);

    return null;
}
Draw.propTypes = {
    active: PropTypes.bool,
    type: PropTypes.string.isRequired,
    condition: PropTypes.func,
    drawend: PropTypes.func,
    drawstart: PropTypes.func,
    maxPoints: PropTypes.number,
    minPoints: PropTypes.number
};
export default Draw;
