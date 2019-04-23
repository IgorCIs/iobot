import ActionTypes from '../constants/ActionsTypes'

const initialState = {
  currentSection: 1
}

const sections = (state = initialState, action) => {
    switch(action.type) {
        case ActionTypes.SET_SECTION:
          return {
            ...state,
            currentSection: action.section
          }
          default:
            return state
    }
}

export default sections