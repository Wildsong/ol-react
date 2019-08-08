import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import createXYZ from 'ol/tilegrid'
import {tile as tileStrategy} from 'ol/loadingstrategy'
import Vector from 'ol/source/vector'
import {DataLoader} from './dataloaders'

const PBF = ({loader, url}) => {
    const layer = useContext(LayerContext)
    const [source] = useState(new Vector({
        strategy: tileStrategy( createXYZ({ tileSize: 512 })),
    }));
    useEffect(() => {
        console.log("source.PBF mounted");
        source.setLoader(DataLoader(loader, url, source));
        layer.setSource(source);
    }, []);
    return null;
}
PBF.propTypes = {
    loader: PropTypes.string,
    url: PropTypes.string,
//    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
//        PropTypes.arrayOf(PropTypes.string)]),
};
export default PBF;
