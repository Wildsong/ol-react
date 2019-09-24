import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Style as olStyle} from 'ol/style'
import olDraw from 'ol/interaction/Draw'
import Collection from 'ol/Collection'

const Draw = ({type, style, geometryFunction, condition, drawstart, drawend, active}) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [interaction,setInteraction] = useState();

    const addDraw = () => {
        const draw = new olDraw({type, style, geometryFunction, condition, source});
        if (active !== undefined) draw.setActive(active);
        if (drawstart !== undefined) draw.on('drawstart', e => drawstart(e));
        if (drawend !== undefined) draw.on(['change:active', 'drawend'], e => drawend(e));
        map.addInteraction(draw);
        setInteraction(draw);
        return draw;
    }

    useEffect(() => {
        const draw = addDraw();
        return () => {
            map.removeInteraction(draw);
        }
    }, []);

    useEffect(() => {
        if (interaction !== undefined)
            map.removeInteraction(interaction);
        addDraw();
    }, [type, active]);

    return null;
}
Draw.propTypes = {
    type: PropTypes.oneOf(['Point', 'LineString', 'LinearRing',
        'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon',
        'GeometryCollection', 'Circle']).isRequired,
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(olStyle)]),
    geometryFunction: PropTypes.func,
    condition: PropTypes.func,
    drawstart: PropTypes.func,
    drawend: PropTypes.func,
//    maxPoints: PropTypes.number,
//    minPoints: PropTypes.number,
    active: PropTypes.bool,
};
export default Draw;
