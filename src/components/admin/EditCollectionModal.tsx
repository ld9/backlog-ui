import { IconFilePlus, IconPlus, IconTrash, IconUserPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../variables";
import Modal from "../Modal";
import MediaLookup from "./MediaLookup";
import UserLookup from "./UserLookup";

export default function EditCollectionModal({
  collection,
  refresh,
  exit,
}: any) {
  const [members, setMembers] = useState<null | Array<any>>([]);
  const [content, setContent] = useState<null | Array<any>>([]);

  const [tentativeMembers, setTentativeMembers] = useState<Array<any>>([]);
  const [tentativeContent, setTentativeContent] = useState<Array<any>>([]);

  const [lookupUser, setLookupUser] = useState(false);
  const [lookupMedia, setLookupMedia] = useState(false);

  const exitLookupUser = () => {
    setLookupUser(false);
  };

  const exitLookupMedia = () => {
    setLookupMedia(false);
  };

  const doUpdate = () => {
    let builtCollection = {
      ...collection,
      members: members?.map((m) => m._id),
      contents: content?.map((c) => c._id),
    };

    fetch(`${BASE_API_URL}/api/collection/${collection._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(builtCollection),
    })
      .then((res) => res.json())
      .then((text) => console.log(text));
  };

  useEffect(() => {
    (async () => {
      // set collection specific things here

      let memberTemp = Promise.all(
        collection.members.map(async (member: any) => {
          const response = await fetch(`${BASE_API_URL}/user/find/${member}`, {
            // headers: {
            //   authorization: `Bearer ${token}`,
            // },
          });

          return await response.json();
        })
      );

      let contentTemp;
      if (collection.contents) {
        contentTemp = Promise.all(
          collection.contents.map(async (id: any) => {
            const response = await fetch(`${BASE_API_URL}/api/media/${id}`, {
              // headers: {
              //   authorization: `Bearer ${token}`,
              // },
            });

            return await response.json();
          })
        );
      } else {
        contentTemp = [];
      }

      setMembers(await memberTemp);
      setContent(await contentTemp);
    })();
  }, [collection]);

  const noCommitExit = () => {
    exit();
  };

  const commitExit = () => {
    doUpdate();
    refresh();
    exit();
  };

  return (
    <Modal>
      {lookupUser ? (
        <UserLookup
          setSelected={setMembers}
          selected={members}
          refresh={refresh}
          exit={exitLookupUser}
        ></UserLookup>
      ) : null}

      {lookupMedia ? (
        <MediaLookup
          setSelected={setContent}
          selected={content}
          refresh={refresh}
          exit={exitLookupMedia}
        ></MediaLookup>
      ) : null}

      {collection ? (
        <div className="collection-edit">
          <h3>
            Editing <span>{collection.title}</span>
          </h3>
          <div className="collection-edit-meat">
            <div>
              {content ? (
                <div>
                  <h4>
                    Contents
                    <span>
                      <a
                        onClick={() => {
                          setLookupMedia(true);
                        }}
                      >
                        <IconFilePlus></IconFilePlus>
                      </a>
                    </span>
                  </h4>
                  {content.map((item, key) => {
                    return (
                      <div key={key}>
                        {item.meta.title} (#
                        {item._id.substring(item._id.length - 6)})
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>No Content (Add some!)</div>
              )}
            </div>
            <div>
              {members ? (
                <div>
                  <h4>
                    Members
                    <span>
                      <a
                        onClick={() => {
                          setLookupUser(true);
                        }}
                      >
                        <IconUserPlus></IconUserPlus>
                      </a>
                    </span>
                  </h4>
                  {members.map((user, key) => {
                    return (
                      <div key={key}>
                        {user.name.first} {user.name.last} (#
                        {user._id.substring(user._id.length - 6)})
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <h4>Members</h4>
                  <div>None - add one!</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <button onClick={noCommitExit}>Cancel</button>
            <button onClick={commitExit}>Commit Changes</button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
