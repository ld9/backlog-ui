import { IconTrash } from "@tabler/icons";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";
import Modal from "../Modal";

export default function EditUserModal({ user, refresh, exit }: any) {
  const [isAdmin, setIsAdmin] = useState(user.permissions.user.admin);
  const [isVerified, setIsVerified] = useState(user.permissions.user.verified);
  const [isPaid, setIsPaid] = useState(user.permissions.user.paid);
  const [languageCode, setLanguageCode] = useGlobalState("language");

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.auth.email);

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  const [media, setMedia] = useState<Array<any>>();
  // const [collections, setCollections] = useState<Array<any>>();

  useEffect(() => {
    (async () => {
      const mediaItems = Promise.all(
        user.permissions.media.map(async (id: any) => {
          const response = await fetch(`${BASE_API_URL}/api/media/${id}`, {
            // headers: {
            //   authorization: `Bearer ${token}`,
            // },
          });

          return await response.json();
        })
      );

      const sorted = (await mediaItems)
        .filter((a: any) => {
          return a.error === undefined;
        })
        .sort((a: any, b: any) => {
          return b.type?.localeCompare(a.type);
        });
      console.log(sorted);

      setMedia(sorted);
    })();
  }, [user]);

  const revokeItem = (id: any) => {
    fetch(`${BASE_API_URL}/user/revoke-media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.auth.email,
        id,
      }),
    }).then(() => {
      setMedia(
        media?.filter((a: any) => {
          return a._id !== id;
        })
      );
      refresh();
    });
  };

  const toggleIsAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  const toggleIsVerified = () => {
    setIsVerified(!isVerified);
  };

  const toggleIsPaid = () => {
    setIsPaid(!isPaid);
  };

  const commitExit = () => {
    console.log(email, name);

    fetch(`${BASE_API_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: user._id,
        auth: {
          email,
        },
        name,
      }),
    }).then(() => {
      refresh();
    });

    exit();
  };

  return (
    <Modal>
      {user ? (
        <div className="user-edit-contain">
          <h3>
            <span className="user-edit-title">
              {strings.admin_users_edit_title}:
            </span>
            <span className="user-edit-name">
              <input
                suppressContentEditableWarning={true}
                onChange={(e) => {
                  setName({
                    last: name.last,
                    first: e.currentTarget.value,
                  });
                }}
                value={name.first}
              />

              <input
                suppressContentEditableWarning={true}
                onChange={(e) => {
                  setName({
                    first: name.first,
                    last: e.currentTarget.value,
                  });
                }}
                value={name.last}
              />
            </span>
          </h3>
          <div className="user-edit-email-id">
            <div className="admin-userlist-user-email">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="admin-userlist-user-id modal-form">
              #{user._id.substring(user._id.length - 6)}
            </div>
          </div>
          <div className="user-edit-permissions">
            <div className="user-edit-permissions-meta">
              <h4>{strings.admin_users_edit_meta_title}</h4>
              <div className="user-edit-permissions-meta-list">
                <table>
                  <tbody>
                    <tr>
                      <td>{strings.admin_users_edit_meta_admin}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isAdmin}
                          onChange={toggleIsAdmin}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td>{strings.admin_users_edit_meta_paid}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isPaid}
                          onChange={toggleIsPaid}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td>{strings.admin_users_edit_meta_email}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isVerified}
                          onChange={toggleIsVerified}
                        ></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="user-edit-permissions-media">
              <h4>{strings.admin_users_edit_media_title}</h4>
              <div className="user-edit-permissions-media-list">
                <table>
                  <tbody>
                    <tr>
                      <th>{strings.admin_users_edit_media_type}</th>
                      <th>{strings.admin_users_edit_media_id}</th>
                      <th>{strings.admin_users_edit_media_title}</th>
                      <th>{strings.admin_users_edit_media_revoke}</th>
                    </tr>
                    {media
                      ? media.map((item, idx) => {
                          return (
                            <tr key={idx}>
                              <td>{item.type}</td>
                              <td>{item._id.substring(item._id.length - 6)}</td>
                              <td>{item.meta?.title}</td>
                              <td
                                className="revoke-icon-cell"
                                onClick={() => {
                                  revokeItem(item._id);
                                }}
                              >
                                <IconTrash></IconTrash>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <button onClick={commitExit}>
              {strings.admin_users_edit_done}
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
