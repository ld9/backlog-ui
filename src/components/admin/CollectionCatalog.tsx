import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../variables";
import EditCollectionModal from "./EditCollectionModal";

export default function CollectionCatalog() {
  let [collections, setCollections] = useState([]);
  
  const [refreshCollectionList, setRefreshCollectionList] = useState(0);
  const [editingCollection, setEditingCollection] = useState<null | Object>(null);

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/collection`)
      .then((res) => res.json())
      .then((json) => setCollections(json));
  }, []);

  const refresh = () => {
    setRefreshCollectionList(refreshCollectionList + 1);
  }

  const exitEdit = () => {
    setEditingCollection(null);
  }

  return (
    <div className="admin-section">
      <div className="admin-heading">
        <h2>Collection Management</h2>
        <div>Create or update video collections</div>
      </div>
      <div className="admin-content">

      {editingCollection ? (
          <div>
            <EditCollectionModal collection={editingCollection} exit={exitEdit} refresh={refresh}></EditCollectionModal>
          </div>
        ) : null}

        <div className="admin-collection-list">
          {collections.map(
            (collection: { title: string; members: Array<any>, content: Array<any> }, idx) => {
              return (
                <div key={idx} className="admin-collection-list-item" onClick={() => {setEditingCollection(collection)}}>
                  <div className="admin-collection-list-item-title">
                    {collection.title}
                  </div>
                  <div className="admin-collection-list-item-iterable">
                    Members:
                    {collection.members.slice(0, 3).map((person: any, idx) => {
                      return (
                        <span key={idx}>#{person.substring(person.length - 6)}</span>
                      );
                    })}
                    {collection.members.length > 3 ? "..." : null}
                  </div>
                  <div className="admin-collection-list-item-iterable">
                    Content Items:
                    {collection.content.slice(0, 3).map((person: any, idx) => {
                      return (
                        <span key={idx}>#{person.substring(person.length - 6)}</span>
                      );
                    })}
                    {collection.content.length > 3 ? "..." : null}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
