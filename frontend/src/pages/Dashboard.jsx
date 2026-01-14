import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../utils/api'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers()
      setUsers(response.data)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    
    try {
      await authAPI.deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Users</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">ID</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created</th>
                  <th className="px-6 py-3 text-center text-gray-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-600">{user.id.substring(0, 8)}...</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
