import ActionTypes from './../constants/ActionsTypes'

const setCurrentProject = project => 
  ({
    type: ActionTypes.SET_PROJECT,
    project
  })

const setCurrentSlide = slide => 
  ({
    type: ActionTypes.SET_PROJECT_SLIDE,
    slide
  })

export {
  setCurrentProject,
  setCurrentSlide
}