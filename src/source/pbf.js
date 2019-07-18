import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {tile as tileStrategy} from 'ol/loadingstrategy'
import {DataLoader} from './dataloaders'

const PBF = (props) => {
    const layer = useContext(LayerContext)
    const [source, setSource] = useState(new olVectorSource({
        strategy: tileStrategy( createXYZ({ tileSize: 512 })),
    }));
    useEffect(() => {
        console.log("source.PBF mounted");
        source.setLoader(DataLoader(props.loader, props.url, source));
        layer.setSource(source);
    }, []);
    return null;
}
//PBF.propTypes = {
//};
export default PBF;
