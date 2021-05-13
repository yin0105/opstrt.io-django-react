import axios from "axios"


export const getInitialData = (token) => {
  return async dispatch => {
    await axios.get(`http://127.0.0.1:8000/api/portfolio/?token=${token}`).then(response => {
      dispatch({ type: "GET_ALL_DATA", data: response.data })
    })
  }
}


export const deleteData = (token, obj) => {
  return dispatch => {
    axios
      .post(`http://127.0.0.1:8000/api/portfolio/?token=${token}`, {
        obj
      })
      .then(response => {
        dispatch({ type: "DELETE_DATA", obj })
      })
  }
}

export const updateData = (token, obj) => {
  return (dispatch, getState) => {
    axios
      .post(`http://127.0.0.1:8000/api/portfolio/?token=${token}`, {
        obj
      })
      .then(response => {
        dispatch({ type: "UPDATE_DATA", obj })
      })
  }
}

export const addData = (token, obj) => {
  return (dispatch, getState) => {
    let params = getState().dataList.params
    axios
      .post(`http://127.0.0.1:8000/api/portfolio/?token=${token}`, {
        obj
      })
      .then(response => {
        dispatch({ type: "ADD_DATA", obj })
        dispatch(getInitialData(token, params))
      })
  }
}
