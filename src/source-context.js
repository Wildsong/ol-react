import React from 'react';  // eslint-disable-line no-unused-vars

const SourceContext = React.createContext();

const SourceProvider = (props) => (
    <SourceContext.Provider value={props.source}>
        {props.children}
    </SourceContext.Provider>
)

export {SourceContext, SourceProvider}
