import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Style as olStyle} from 'ol/style'
import {Draw as olDraw} from 'ol/interaction'

const Draw = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [interaction, setInteraction] = useState(new olDraw({
        ...props,
        source
    }));

    useEffect(() => {
        interaction.addEventListener("drawend", (evt) => {
            if (props.drawend !== undefined) {
                props.drawend(evt);
            }
        });

        map.addInteraction(interaction);

        console.log("Setting draw type to:", props.type);

        return () => {
            map.removeInteraction(interaction);
        }
    }, []);

    useEffect(() => {
        if (props.type !== interaction.get('type')) {
            map.removeInteraction(interaction);
            setInteraction(new olDraw({
                ...props,
                source
            }))
            console.log("Draw type changed", props, interaction);
            map.addInteraction(interaction);
        }
    }, [props.type]);

    return null;
}
Draw.propTypes = {
    active: PropTypes.bool,
    type: PropTypes.oneOf(['Point', 'LineString', 'LinearRing',
        'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon',
        'GeometryCollection', 'Circle']).isRequired,
    condition: PropTypes.func,
    drawstart: PropTypes.func,
    drawend: PropTypes.func,
    maxPoints: PropTypes.number,
    minPoints: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.func,
        PropTypes.instanceOf(olStyle),
    ]),
};
export default Draw;
