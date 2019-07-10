import { NOT_FOUND } from 'redux-first-router'

const components = {
    EXAMPLE0: "Example0",
    EXAMPLE1: "Example1",
    EXAMPLE2: "Example2",
    EXAMPLE3: "Example3",
    EXAMPLE4: "Example4",
    EXAMPLE5: "Example5",
    EXAMPLE6: "Example6",
    EXAMPLE7: "Example7",
    EXAMPLE8: "Example8",
    [NOT_FOUND]: 'NotFound'
}

const initialState = "Example0"

export const page = (state = initialState, action = {}) => {
    const newState = components[action.type] || state
    console.log("page reducer: ", action.type, " state=", state, " newState=", newState);
    return newState
}
