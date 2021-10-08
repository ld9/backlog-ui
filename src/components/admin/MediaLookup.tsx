import { useEffect, useState } from "react";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";
import Modal from "../Modal";

export default function MediaLookup({
  setSelected,
  selected,
  refresh,
  exit,
}: any) {
  const [catalog, setCatalog] = useState<Array<any>>([]);
  const [lookup, setLookup] = useState("");

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/media/catalog`)
      .then((res) => res.json())
      .then((json) => {
        setCatalog(
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
        <h3>{strings.admin_collections_media_title}</h3>
        <div className="lookup-list">
          <div className="lookup-list-title">
            {strings.admin_collections_media_contents}
          </div>
          <div className="lookup-list-contents">
            {selected?.map((media: any, idx: number) => {
              return (
                <div key={idx}>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {
                      setSelected(
                        selected.filter((a: any) => {
                          return a !== media;
                        })
                      );

                      setCatalog([...catalog, media]);
                    }}
                  ></input>
                  {media.meta.title} #
                  {media._id.substring(media._id.length - 6)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="lookup-list">
          <div className="lookup-list-title">
            {strings.admin_collections_media_catalog}
          </div>
          <div className="lookup-list-filter">
            <input
              type="text"
              placeholder="filter or search for content"
              value={lookup}
              onChange={(e) => {
                setLookup(e.target.value);
              }}
            ></input>
          </div>
          <div className="lookup-list-contents">
            {catalog
              .filter((a: any) => {
                return JSON.stringify(a)
                  .toLowerCase()
                  .includes(lookup.toLowerCase());
              })
              .map((media, idx) => {
                return (
                  <div key={idx}>
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {
                        setCatalog(
                          catalog.filter((a: any) => {
                            return a !== media;
                          })
                        );

                        setSelected([...selected, media]);
                      }}
                    ></input>
                    {media.meta.title} #
                    {media._id.substring(media._id.length - 6)}
                  </div>
                );
              })}
          </div>
        </div>
        <button onClick={exit}>{strings.admin_collections_media_done}</button>
      </div>
    </Modal>
  );
}
