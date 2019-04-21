import ActionTypes from './../constants/ActionsTypes'

const setCurrentSection = section => 
  ({
    type: ActionTypes.SET_SECTION,
    section
  })

export {
  setCurrentSection,
}