import "../../styles/admin.css";
import { strings } from "../../strings";
import ContentAdd from "../../components/admin/ContentAdd";

export default function Admin() {
  return (
    <div>
      <div className="admin-section admin-title">
        <h1>{strings.admin_title}</h1>
      </div>
      <div>
        <ContentAdd></ContentAdd>
      </div>
      <div className="admin-section">
        <div className="admin-heading">
          <h2>Filler section</h2>
          <div>Used to estimate visual appearance</div>
        </div>
        <div className="admin-content"></div>
      </div>
    </div>
  );
}
