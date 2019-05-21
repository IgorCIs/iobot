import ActionTypes from './../constants/ActionsTypes'

const setCurrentProject = project => 
  ({
    type: ActionTypes.SET_PROJECT,
    project
  })

const setCurrentSlide = (slide, project) => 
  ({
    type: ActionTypes.SET_PROJECT_SLIDE,
    project,
    slide
  })

export {
  setCurrentProject,
  setCurrentSlide
}