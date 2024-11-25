import {createRoot} from "react-dom/client"
import React, {useEffect, useState} from "react"

document.addEventListener("turbo:load", () => {
  const root = createRoot(document.getElementById("root"))

  root.render(<UsersIndex/>);
});

function UsersIndex() {
  const [users, setUsers] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetch("/users", {
      headers: {Accept: "application/json"},
    }).then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div className="grid grid-cols-2 gap-x-2">
      <div>
        <div className="mb-16">
          <h1 className="text-4xl text-center">Users React version</h1>
        </div>
        {users
         ? <table id="users" className="min-w-full divide-y divide-gray-300">
           <thead>
           <tr>
             <th>email</th>
           </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
           {users.map(user =>
             <tr key={`user-${user.id}`}
                 className={`cursor-pointer ${selectedUser?.id === user.id
                                              ? "bg-yellow-200"
                                              : ""}`}
                 onClick={() => setSelectedUser(user)}>
               <td>{user.email}</td>
             </tr>)}
           </tbody>
         </table>
         : <div className="text-center text-4xl">Loading...</div>
        }
      </div>
      <div className="border rounded shadow" id="user-profile">
        {selectedUser && <UserProfile userId={selectedUser.id}/>}
      </div>
    </div>
  )
}

function UserProfile({userId}) {
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    fetch(` /users/${userId}/user_profile`, {
      headers: {Accept: "application/json"},
    }).then(res => res.json())
      .then(data => setUserProfile(data))
  }, [userId])

  return (<>
      {userProfile
       ? <div>
         <p>
           <strong>User:</strong>
           {userProfile.user_id}
         </p>

         <p>
           <strong>Name:</strong>
           {userProfile.name}
         </p>

         <p>
           <strong>Name jp:</strong>
           {userProfile.name_jp}
         </p>

         <p>
           <strong>Age:</strong>
           {userProfile.age}
         </p>
       </div>
       : <div>Loading...</div>
      }
    </>
  )
}
