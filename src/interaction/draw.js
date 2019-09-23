import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Style as olStyle} from 'ol/style'
import {Draw as olDraw} from 'ol/interaction'

const Draw = ({type, style, condition, drawstart, drawend}) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [interaction,setInteraction] = useState();

    useEffect(() => {
        console.log("initial");
        const interaction = new olDraw({type, style, condition, source});

        if (drawstart !== undefined) {
            interaction.on('drawstart', e => drawstart(e));
        }
        if (drawend !== undefined) {
            interaction.on(['change:active', 'drawend'], e => drawend(e));
        }
        map.addInteraction(interaction);

        console.log("Draw type set to:", type);

//        return () => {
//            map.removeInteraction(interaction);
//        }
    }, []);

    useEffect(() => {
        if (interaction !== undefined) {
            console.log('Draw was', interaction);
            map.removeInteraction(interaction);
        }
        const draw = new olDraw({type, style, condition, source});
        console.log("Draw type set to ", draw);
        map.addInteraction(draw);
        setInteraction(draw);
    }, [type]);

    return null;
}
Draw.propTypes = {
    type: PropTypes.oneOf(['Point', 'LineString', 'LinearRing',
        'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon',
        'GeometryCollection', 'Circle']).isRequired,
    condition: PropTypes.func,
    drawstart: PropTypes.func,
    drawend: PropTypes.func,
//    maxPoints: PropTypes.number,
//    minPoints: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.func,
        PropTypes.instanceOf(olStyle),
    ]),
};
export default Draw;
