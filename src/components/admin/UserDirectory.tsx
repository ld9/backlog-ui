import { IconPencil, IconStars } from "@tabler/icons";
import { useEffect, useState } from "react";

import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";
import EditUserModal from "./EditUserModal";

export default function UserDirectory() {
  const [token, setToken] = useGlobalState("token");
  const [users, setUsers] = useState<Array<any>>([]);
  const [editingUser, setEditingUser] = useState<null | Object>(null);
  const [refreshUserList, setRefreshUserList] = useState(0);
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  const refresh = () => {
    fetch(`${BASE_API_URL}/user/directory`)
      .then((res) => res.json())
      .then((json) => {
        setUsers(json);
        console.log("refreshed");
        setRefreshUserList(refreshUserList + 1);
      });
  };

  const exitEdit = () => {
    setEditingUser(null);
  };

  // Run on mount
  useEffect(() => {
    console.log("refreshuserlist");
    fetch(`${BASE_API_URL}/user/directory`)
      .then((res) => res.json())
      .then((json) => {
        setUsers(json);
        console.log("refreshed");
      });
  }, [refreshUserList]);

  return (
    <div className="admin-section">
      <div className="admin-heading">
        <h2>{strings.admin_users_title}</h2>
        <div>{strings.admin_users_desc}</div>
      </div>
      <div className="admin-content">
        {editingUser ? (
          <div>
            <EditUserModal
              user={editingUser}
              exit={exitEdit}
              refresh={refresh}
            ></EditUserModal>
          </div>
        ) : null}
        <div className="admin-userlist">
          {users.map((user, idx) => (
            <div
              key={idx}
              className="admin-userlist-user"
              onClick={() => {
                setEditingUser(user);
              }}
            >
              <div className="admin-userlist-user-info">
                <div className="admin-userlist-user-email">
                  {user.auth.email}
                </div>
                <div className="admin-userlist-user-id">
                  #{user._id.substring(user._id.length - 6)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
