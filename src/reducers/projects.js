import ActionTypes from '../constants/ActionsTypes'

const initialState = {
  active: 0,
  activeSlide: 0
}

const projects = (state = initialState, action) => {
    switch(action.type) {
        case ActionTypes.SET_PROJECT:
          return {
            ...state,
            active: action.project,
            activeSlide: 0
          }

        case ActionTypes.SET_PROJECT_SLIDE:
          return {
            ...state,
            activeSlide: action.slide,
          }
          
        default:
          return state
    }
}

export default projects