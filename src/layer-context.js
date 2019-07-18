import React from 'react'

// https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react

const LayerContext = React.createContext();

const LayerProvider = (props) => (
    <LayerContext.Provider value={props.layer}>
        {props.children}
    </LayerContext.Provider>
)

export {LayerContext, LayerProvider}
