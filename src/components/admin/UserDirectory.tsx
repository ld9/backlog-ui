import { IconPencil, IconStars } from "@tabler/icons";
import { useEffect, useState } from "react";

import { useGlobalState } from "../../state";
import { BASE_API_URL } from "../../variables";

export default function UserDirectory() {
  const [token, setToken] = useGlobalState("token");

  const [users, setUsers] = useState<Array<any>>([]);

  // Run on mount
  useEffect(() => {
    fetch(`${BASE_API_URL}/user/directory`)
      .then((res) => res.json())
      .then((json) => setUsers(json));
  }, []);

  return (
    <div className="admin-section">
      <div className="admin-heading">
        <h2>User Management</h2>
        <div>Add, remove, or edit users and their related permissions</div>
      </div>
      <div className="admin-content">
        <div className="admin-userlist">
          {users.map((user, idx) => (
            <div key={idx} className="admin-userlist-user">
              <div className="admin-userlist-user-info">
                <div className="admin-userlist-user-email">
                  {user.auth.email}
                </div>
                <div className="admin-userlist-user-id">
                  #{user._id.substring(user._id.length - 6)}
                </div>
              </div>
              {/* <div className="admin-userlist-user-controls">
                {user.permissions.user.admin ? (
                  <div title="Indicates that user is an administrator">
                    <IconStars></IconStars>
                  </div>
                ) : null}
                <div className="admin-userlist-user-controls-edit" title="Edit this users details">
                  <IconPencil></IconPencil>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
