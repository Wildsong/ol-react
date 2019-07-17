import React from 'react'

const FeatureContext = React.createContext();
const FeatureProvider = (props) => (
    <FeatureContext.Provider value={props.feature}>
        {props.children}
    </FeatureContext.Provider>
)
export { FeatureContext, FeatureProvider }
