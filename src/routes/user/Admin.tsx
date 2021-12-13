import "../../styles/admin.css";
import { strings } from "../../strings";
import ContentAdd from "../../components/admin/ContentAdd";
import UserDirectory from "../../components/admin/UserDirectory";
import CollectionCatalog from "../../components/admin/CollectionCatalog";
import { useGlobalState } from "../../state";
import { useEffect } from "react";
import FreeSpace from "../../components/admin/FreeSpace";

export default function Admin() {
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  return (
    <div>
      <div className="admin-section admin-title">
        <h1>{strings.admin_title}</h1>
      </div>
      <div>
        <ContentAdd></ContentAdd>
        <UserDirectory></UserDirectory>
        <CollectionCatalog></CollectionCatalog>
        <FreeSpace></FreeSpace>
      </div>
      {/* <div className="admin-section">
        <div className="admin-heading">
          <h2>Filler section</h2>
          <div>Used to estimate visual appearance</div>
        </div>
        <div className="admin-content"></div>
      </div> */}
    </div>
  );
}
