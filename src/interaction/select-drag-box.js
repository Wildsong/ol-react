import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import {Style} from 'ol/style'
import {Collection} from 'ol'
import {Condition} from 'ol/events'
import {DragBox as olDragBox} from 'ol/interaction'

const SelectDragBox = (props) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);

    const boxstart = (e) => {
//        console.log("onBoxStart", e)
        //props.features.clear(); We want to be able to select several times and collect features so don't call this
        e.stopPropagation(); // this stops draw interaction
    }
    const boxend = (e) => {
//        console.log("onBoxEnd", e)
        const extent = dragboxInteraction.getGeometry().getExtent();
        source.forEachFeatureIntersectingExtent(extent, (feature) => {
            props.features.push(feature);
        });
        e.stopPropagation(); // this stops draw interaction
        props.selected(e);
    }

    const [dragboxInteraction, setDragboxInteraction] = useState(() => {
        const interaction = new olDragBox({
            condition: props.condition
        });
        //interaction.on("boxstart", boxstart);
        //use onBoxEnd property instead?
        interaction.on("boxend", boxend);
        return interaction;
    });

    useEffect(() => {
//        console.log("SelectDragBox mounted", dragboxInteraction);
        map.addInteraction(dragboxInteraction);
        return () => {
//            console.log("SelectDragBox UNMOUNTED");
            map.removeInteraction(dragboxInteraction);
        }
    }, []);

    // Read about dragbox selection here
    // https://openlayers.org/en/latest/examples/box-selection.html?q=select

    return null;
}
SelectDragBox.propTypes = {
    //condition: PropTypes.instanceOf(Condition), // default is singleClick(), can be a func
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Style)]),
    features: PropTypes.instanceOf(Collection),
    selected: PropTypes.func.isRequired,
};
export default SelectDragBox;
