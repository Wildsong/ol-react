import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {LayerProvider} from '../layer-context' // eslint-disable-line no-unused-vars
import LayerGroup from 'ol/layer/Group'

const Group = (props) => {
    const map = useContext(MapContext);

    useEffect(() => {
        console.log("group added", props.group);
        map.addLayer(props.group);
        return () => {
            console.log("group removed");
            map.removeLayer(props.group);
        }
    }, []);

    return (
        <LayerGroupProvider group={props.group}>
            {props.children}
        </LayerGroupProvider>
    );
}
Group.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
    //group: PropTypes.instanceOf(LayerGroup)
};
export default Group;
