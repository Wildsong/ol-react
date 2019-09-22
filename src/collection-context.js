import React from 'react';  // eslint-disable-line no-unused-vars

// Currently I use this to create groupings of layers,
// in theory it works for any collection (?)
// https://upmostly.com/tutorials/how-to-use-the-usecontext-hook-in-react

const CollectionContext = React].createContext();

const CollectionProvider = (props) => (
    <CollectionContext.Provider collection={props.collection}>
        {props.children}
    </CollectionContext.Provider>
)

export {CollectionContext, CollectionProvider}
