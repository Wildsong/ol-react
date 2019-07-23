import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerContext} from '../layer-context'
import {SourceContext} from '../source-context'
import {Style as olStyle} from 'ol/style'
import {Layer as olLayer, Collection} from 'ol'
import {Select as olSelect} from 'ol/interaction'
import {Condition} from 'ol/events'

const Select = (props) => {
    const map = useContext(MapContext);
    const layer = useContext(LayerContext);
    const source = useContext(SourceContext);
    const [selectInteraction, setSelectInteraction] = useState(() => {
        const interaction = new olSelect({
            //source,
            condition: props.condition,
            features: props.features,
            layers: [layer],
            style: props.style,
        });
        interaction.on("select", props.selected);
        return interaction;
    });

    useEffect(() => {
        console.log("Select mounted", selectInteraction);
        map.addInteraction(selectInteraction);
        return () => {
            console.log("Select UNMOUNTED");
            map.removeInteraction(selectInteraction);
        }
    }, []);

    return null;
}
Select.propTypes = {
    //condition: PropTypes.instanceOf(Condition), // default is singleClick(), can be a func
    style: PropTypes.instanceOf(olStyle),
    multi: PropTypes.bool,
    features: PropTypes.instanceOf(Collection),
    selected: PropTypes.func,
};
export default Select;
