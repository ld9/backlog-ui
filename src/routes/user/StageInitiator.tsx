import { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { watchForResponse, socket } from "../../socket";
import { useGlobalState } from "../../state";
import { MessageInform, SocketBeaconMessageType } from "../../types/SocketInfoMessage";
import Stage from "../../types/StageType";

export default function StageInitiator() {
  let { newStage } = useParams() as {
    newStage: string;
  };

  const location = useLocation();
  const remotePath = location.pathname.startsWith("/user/remote");

  let history = useHistory();

  let [stage, setStage] = useGlobalState("stage");
  let [isRemote, setIsRemote] = useGlobalState("isRemote");
  let [user, setUser] = useGlobalState("user");

  

  useEffect(() => {

    async function doJoin(updatedStage: Stage) {
      socket.emit("request-join", {stage: updatedStage.name, user: `${user.name.first}${remotePath ? ' (Remote Control)' : ''}`});
      await watchForResponse('inform-join');
      
      setStage(updatedStage);
      history.replace("/user/stage");
  
      return;
    } 

    if (newStage !== "") {
      let updatedStage;

      if (remotePath) {
        setIsRemote(true);
      }

      if (newStage === "create") {
        updatedStage = {
          ...stage,
          name: (Math.random() * 9999999).toString(36).substring(0, 4),
        };
      } else {
        updatedStage = {
          ...stage,
          name: newStage,
        };
      }

      // console.log('doing join')
      doJoin(updatedStage);
      // console.log('join did')


    }
  }, [setStage, newStage, history, user]);

  return <div>
    <div>
      <h2>Connecting to Server</h2>
      <p>Trying to {newStage == 'create' ? 'create a new room for you' : `connect you to the stage "${newStage}"`}</p>
    </div>
  </div>;
}
