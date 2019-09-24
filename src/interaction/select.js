import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerContext} from '../layer-context'
//import {SourceContext} from '../source-context'
import Style from 'ol/style/Style'
import Collection from 'ol/Collection'
import Condition from 'ol/events/condition'
import olSelect from 'ol/interaction/Select'

const Select = ({condition, style, multi, features, selected, active}) => {
    const map = useContext(MapContext);
    const layer = useContext(LayerContext);
    //const source = useContext(SourceContext);
    const [interaction, setInteraction] = useState();

    useEffect(() => {
        const select = new olSelect({condition, style, multi, features, layers: [layer]});
        if (active !== undefined) select.setActive(active);

        select.on("select", selected);
        map.addInteraction(select);
        setInteraction(select);
        return () => {
            map.removeInteraction(select);
        }
    }, []);

    useEffect(() => {
        if (active !== undefined && interaction !== undefined)
            interaction.setActive(active);
    }, [active]);

    return null;
}
Select.propTypes = {
    condition: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Condition)]), // default is singleClick(), can be a func
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Style)]),
    multi: PropTypes.bool,
    features: PropTypes.instanceOf(Collection),
    selected: PropTypes.func,
    active: PropTypes.bool,
};
export default Select;
