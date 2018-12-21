import React from 'react'
export const LayerContext = React.createContext({
    map   : null,   // this should be the OpenLayers map object
    layer : null
});
