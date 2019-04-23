import ActionTypes from '../constants/ActionsTypes'

const initialState = {
  data: null,
  loading: false,
  active: null,
  error: null
}

const data = (state = initialState, action) => {
    switch(action.type) {
      case ActionTypes.FETCH_DATA_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
          data: null,
        }
      case ActionTypes.FETCH_DATA_SUCCESS: {
        return {
          ...state,
          loading: false,
          error: false,
          data: action.payload.data
        }
      }
      case ActionTypes.FETCH_DATA_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          data: null
        }
        default:
          return state
    }
}

export default data