import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchUsers } from '../features/users/usersSlice'
import { deleteUsers, postUsers, editUsers } from '../features/users/usersSlice'
import { nanoid } from '@reduxjs/toolkit'

const columns = [
  { title: 'ID', field: 'id', filterPlaceholder: 'Filter by ID' },
  { title: 'Name', field: 'name', filterPlaceholder: 'Filter by Name' },
  {
    title: 'UserName',
    field: 'username',
    filterPlaceholder: 'Filter by UserName',
  },
  { title: 'Email', field: 'email', filtering: false },
  { title: 'Phone', field: 'phone', filtering: false },
  { title: 'Website', field: 'website', filtering: false },
]

const ReactMaterialTable = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  // LOADING AND ERROR INDICATORS
  const loading = useSelector((state) => state.users.isLoading)
  const error = useSelector((state) => state.users.isError)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((result) =>
        setData(
          result.map((user) => {
            const { id, name, username, email, phone, website } = user
            return { id, name, username, email, phone, website }
          })
        )
      )
    // FOR LOADING AND ERROR
    dispatch(fetchUsers())
  }, [dispatch])

  if (loading) {
    return <h2>FETCHING DATA...</h2>
  }

  if (error) {
    return <h2>{error}</h2>
  }

  return (
    <div>
      {data && (
        <MaterialTable
          data={data}
          columns={columns}
          editable={{
            // ADD NEW USER ROW
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  setData([...data, newData])
                  dispatch(
                    postUsers({
                      newObj: {
                        id: newData.id || nanoid(),
                        name: newData.name,
                        username: newData.username,
                        email: newData.email,
                        phone: newData.phone,
                        website: newData.website,
                      },
                    })
                  )

                  resolve()
                }, 1000)
              }),

            // UPDATE USER ROW
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...data]
                  const index = oldData.tableData.id
                  dataUpdate[index] = newData
                  setData([...dataUpdate])
                  console.log(index)
                  dispatch(editUsers({ id: index, newObj: { ...newData } }))
                  resolve()
                }, 1000)
              }),

            // DELETE USER ROW
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...data]
                  const index = oldData.tableData.id
                  dataDelete.splice(index, 1)
                  setData([...dataDelete])
                  dispatch(deleteUsers(index))
                  resolve()
                }, 1000)
              }),
          }}
          title={`User's Information`}
          // REACT MATERIAL TABLE STYLING
          options={{
            searchAutoFocus: true,
            searchFieldVariant: 'outlined',
            filtering: true,
            pageSizeOptions: [2, 5, 10, 15],
            pageSize: 2,
            paginationType: 'stepped',
            showFirstLastPageButtons: false,
            addRowPosition: 'first',
            actionsColumnIndex: -1,
            grouping: true,
            columnsButton: true,
            rowStyle: (data, index) =>
              index % 2 === 0 ? { background: 'hsl(209, 23%, 60%)' } : null,
            headerStyle: { background: 'hsl(209, 34%, 30%)', color: '#fff' },
          }}
        />
      )}
    </div>
  )
}

export default ReactMaterialTable
