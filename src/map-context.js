import React from 'react';  // eslint-disable-line no-unused-vars

// https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react

const MapContext = React.createContext();

const MapProvider = (props) => {
    return (
        <MapContext.Provider value={props.map}>
            {props.children}
        </MapContext.Provider>
    )
}

export {MapContext, MapProvider}
