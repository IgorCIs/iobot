import ActionTypes from './../constants/ActionsTypes'
import { callApi } from '../libs/callApi';
import Api from './../constants/Api'

const fetchDataFail = error => 
  ({
    type: ActionTypes.FETCH_DATA_FAIL,
    payload: { error }
  })

const fetchDataRequest = () => 
  ({
    type: ActionTypes.FETCH_DATA_REQUEST
  })

const fetchDataSucess = data => 
  ({
    type: ActionTypes.FETCH_DATA_SUCCESS,
    payload: { data }
  })

const fetchData = () => async dispatch => {
  dispatch(fetchDataRequest())
  const res = await callApi(Api.API_URL)

  res.json ? 
    dispatch(fetchDataSucess(res.json))
    :
    dispatch(fetchDataFail(res.error))
}

export {
  fetchData
}