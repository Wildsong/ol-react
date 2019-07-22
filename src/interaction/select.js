import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Select as olSelect} from 'ol/interaction'
import {Collection} from 'ol'

const Select = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    //const olEvents = ["select"];
    const [select, setSelect] = useState(() => {
        const interaction = new olSelect({
            source,
            ...props
        });
        return interaction;
    });

    useEffect(() => {
        console.log("Select mounted");
        map.addInteraction(select);
        return () => {
            console.log("Select UNMOUNTED");
            map.removeInteraction(select);
        }
    }, []);
}
Select.propTypes = {
     condition: PropTypes.func,  // can be from ol/events/condition or custom
     select: PropTypes.func,     // handle select olEvents
     features: PropTypes.instanceOf(Collection),
     style: PropTypes.object
};
export default Select;
