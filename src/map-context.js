import React from 'react'

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
