import React from 'react';  // eslint-disable-line no-unused-vars

// https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react

const LayerGroupContext = React.createContext();

const LayerGroupProvider = (props) => (
    <LayerGroupContext.Provider value={props.layerGroup}>
        {props.children}
    </LayerGroupContext.Provider>
)

export {LayerGroupContext, LayerGroupProvider}
