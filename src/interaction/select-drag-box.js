import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {SourceContext} from '../source-context'
import Style from 'ol/style/Style'
import Collection from 'ol/Collection'
import Condition from 'ol/events/condition'
import {DragBox as olDragBox} from 'ol/interaction'

const interinfo = (interactions) => {
    console.log("select interactions: ", interactions.getLength());
    interactions.forEach( i => console.log(i) );
}

const SelectDragBox = (condition, style, features, selected, active) => {
    const map = useContext(MapContext);
    const source = useContext(SourceContext);
    const [interaction, setInteraction] = useState();

/*
    const boxstart = (e) => {
//        console.log("onBoxStart", e)
        //features.clear(); We want to be able to select several times and collect features so don't call this
        e.stopPropagation(); // this stops draw interaction
    }
*/
    const boxend = (e) => {
        const extent = dragboxInteraction.getGeometry().getExtent();
        source.forEachFeatureIntersectingExtent(extent, (feature) => {
            features.push(feature);
        });
        e.stopPropagation(); // this stops draw interaction
        selected(e);
    }


    useEffect(() => {
        const dragbox = new olDragBox({condition});
        //interaction.on("boxstart", boxstart);
        //use onBoxEnd property instead?
        dragbox.on("boxend", boxend);

        map.addInteraction(dragbox);
        setInteraction(dragbox);
        return () => {
            map.removeInteraction(dragbox);
        }
    }, []);

    useEffect(() => {
        if (active !== undefined && interaction !== undefined)
            interaction.setActive(active);
        interinfo(map.getInteractions());
    }, [active]);

    // Read about dragbox selection here
    // https://openlayers.org/en/latest/examples/box-selection.html?q=select

    return null;
}
SelectDragBox.propTypes = {
    condition: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Condition)]), // default is singleClick(), can be a func
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Style)]),
    features: PropTypes.instanceOf(Collection),
    selected: PropTypes.func.isRequired,
    active: PropTypes.bool,
};
export default SelectDragBox;
