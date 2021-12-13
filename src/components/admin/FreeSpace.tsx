import { useEffect, useState } from "react";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";

export default function FreeSpace() {
  const [languageCode, setLanguageCode] = useGlobalState("language");

  const [spaceStats, setSpaceStats] = useState({
    total: "0",
    used: "0",
    free: "0",
    percent: "0",
  });

  useEffect(() => {
    fetch(`${BASE_API_URL}/fs`)
      .then((res) => res.json())
      .then((res) => {
        setSpaceStats(res);
      });
  }, []);

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  return (
    <div className="admin-section">
      <div className="admin-heading">
        <h2>{strings.admin_free_title}</h2>
        <div>{strings.admin_free_desc}</div>
      </div>
      <div className="admin-content">
        <div>
          {strings.admin_free_free}: {spaceStats.free}
        </div>
        <div>
          {strings.admin_free_used}: {spaceStats.used}/{spaceStats.total} (
          {spaceStats.percent})
        </div>
        <div>
          <progress
            className="admin-freespace-bar"
            value={spaceStats.percent.split("%")[0]}
            max={100}
          />
        </div>
      </div>
    </div>
  );
}
