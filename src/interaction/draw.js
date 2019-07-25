import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {GeometryType as olGeometryType} from 'ol/geom'
import {Style as olStyle} from 'ol/style'
import {Draw as olDraw} from 'ol/interaction'

const Draw = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    //const olEvents = ["drawend", "drawstart"];

    useEffect(() => {
        console.log("Draw mounted", props.type);

        const interaction = new olDraw({
            ...props,
            source
        });
        interaction.addEventListener("drawend", (evt) => {
            if (typeof props.drawend !== 'undefined') {
                console.log("drawend", evt);
                props.drawend(evt);
            }
        });

        map.addInteraction(interaction);
        return () => {
            console.log("Draw UNMOUNTED");
            map.removeInteraction(interaction);
        }
    }, [props.type]);

/*
This did not work.
    useEffect(() => {
        console.log("Draw type changed", draw, props);
        draw.setProperties({type:props.type});
    }, [props.type]);
*/
    return null;
}
Draw.propTypes = {
    active: PropTypes.bool,
    type: PropTypes.string.isRequired,
    condition: PropTypes.func,
    drawend: PropTypes.func,
    drawstart: PropTypes.func,
    maxPoints: PropTypes.number,
    minPoints: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.func,
        PropTypes.instanceOf(olStyle),
    ]),
};
export default Draw;
