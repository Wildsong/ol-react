import React from 'react';  // eslint-disable-line no-unused-vars

const FeatureContext = React.createContext();
const FeatureProvider = (props) => (
    <FeatureContext.Provider value={props.feature}>
        {props.children}
    </FeatureContext.Provider>
)
export { FeatureContext, FeatureProvider }
