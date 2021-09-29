import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
})

// GET/FETCH USERS(OPTIONAL) || BASICALLY FOR LOADING AND ERROR
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  return fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
    res.json()
  )
})

// ADD AND POST USERS
export const postUsers = createAsyncThunk(
  'user/postUsers',
  async ({ newObj }) => {
    await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      body: JSON.stringify(newObj),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
)

// EDIT USERS
export const editUsers = createAsyncThunk(
  'user/editUsers',
  async ({ id, newObj }) => {
    console.log({ id, newObj })
    await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newObj),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
)

// DELETE USERS
export const deleteUsers = createAsyncThunk('user/deleteUsers', async (id) => {
  await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'DELETE',
  })
})

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    isLoading: false,
    isError: false,
  }),
  reducers: {},
  extraReducers: {
    // FETCH DATA FOR SHOWING LOADING AND ERRORS IF ANY.
    [fetchUsers.pending]: (state) => {
      state.isLoading = true
    },
    [fetchUsers.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      // IN CASE WE USE DISPATCH.
      // usersAdapter.setAll(
      //   state,
      //   (payload = payload.map((user) => {
      //     const { id, name, username, email, phone, website } = user
      //     return { id, name, username, email, phone, website }
      //   }))
      // )
    },
    [fetchUsers.rejected]: (state, { error }) => {
      state.isLoading = false
      state.isError = error.message
    },
  },
})

export const usersSelector = usersAdapter.getSelectors((state) => state.users)
export const { actions } = usersSlice
export default usersSlice.reducer
