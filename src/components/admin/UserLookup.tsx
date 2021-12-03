import { useEffect, useState } from "react";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";
import Modal from "../Modal";

export default function UserLookup({
  setSelected,
  selected,
  refresh,
  exit,
}: any) {
  const [directory, setDirectory] = useState<Array<any>>([]);
  const [lookup, setLookup] = useState("");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  useEffect(() => {
    fetch(`${BASE_API_URL}/user/directory`)
      .then((res) => res.json())
      .then((json) => {
        setDirectory(
          json.filter((a: any) => {
            for (let i = 0; i < selected.length; i++) {
              if (a._id == selected[i]._id) {
                return false;
              }
            }
            return true;
          })
        );
      });
  }, []);

  return (
    <Modal>
      <div>
        <h3>{strings.admin_collections_user_title}</h3>
        <div className="lookup-list">
          <div className="lookup-list-title">
            {strings.admin_collections_user_approved}
          </div>
          <div className="lookup-list-contents">
            {selected?.map((user: any) => {
              return (
                <div>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {
                      setSelected(
                        selected.filter((a: any) => {
                          return a !== user;
                        })
                      );

                      setDirectory([...directory, user]);
                    }}
                  ></input>
                  {user.name.first} {user.name.last} #
                  {user._id.substring(user._id.length - 6)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="lookup-list">
          <div className="lookup-list-title">
            {strings.admin_collections_user_directory}
          </div>
          <div className="lookup-list-filter">
            <input
              type="text"
              placeholder="filter or search for users"
              value={lookup}
              onChange={(e) => {
                setLookup(e.target.value);
              }}
            ></input>
          </div>
          <div className="lookup-list-contents">
            {directory
              .filter((a: any) => {
                return JSON.stringify(a)
                  .toLowerCase()
                  .includes(lookup.toLowerCase());
              })
              .map((user) => {
                return (
                  <div>
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {
                        setDirectory(
                          directory.filter((a: any) => {
                            return a !== user;
                          })
                        );

                        setSelected([...selected, user]);
                      }}
                    ></input>
                    {user.name.first} {user.name.last} #
                    {user._id.substring(user._id.length - 6)}
                  </div>
                );
              })}
          </div>
        </div>
        <button onClick={exit}>{strings.admin_collections_user_done}</button>
      </div>
    </Modal>
  );
}
