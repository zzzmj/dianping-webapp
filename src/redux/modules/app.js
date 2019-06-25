// actionTypes
export const types = {
  CLEAR_ERROR: 'APP/CLEAR_ERROR'
}

// actionCreators
export const actions = {
  clearError: () => ({
    type: types.CLEAR_ERROR
  })
}

// reducer
const reducer = (state = {}, action) => {
    const { type, error } = action
    if (type === types.CLEAR_ERROR) {
        return {...state, error: null}
    } else if (error) {
        return {...state, error: error}
    }
    return state
}

export default reducer

// selectors
export const getError = (state) => {
    return state.app.error
}