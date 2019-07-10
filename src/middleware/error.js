export const errorReporter = store => {
    return next => action => {
        try {
            return next(action)
        } catch(err) {
            console.error('Middleware Error', err)
            throw err
        }
    }
}
