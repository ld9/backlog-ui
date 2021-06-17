import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { watchForResponse, socket } from "../../socket";
import { useGlobalState } from "../../state";
import Stage from "../../types/StageType";

export default function StageInitiator() {
  let { newStage } = useParams() as {
    newStage: string;
  };

  let history = useHistory();

  let [stage, setStage] = useGlobalState("stage");

  async function doJoin(updatedStage: Stage) {
    socket.emit("request-join", stage.name);
    await watchForResponse('inform-join');
    
    setStage(updatedStage);
    history.replace("/user/stage");

    return;
  } 

  useEffect(() => {
    if (newStage !== "") {
      let updatedStage;

      console.log(stage);

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

      console.log('doing join')
      doJoin(updatedStage);
      console.log('join did')


    }
  }, [setStage, newStage, history]);

  return <div>
    <div>
      <h2>Connecting to Server</h2>
      <p>Trying to {newStage == 'create' ? 'create a new room for you' : `connect you to the stage "${newStage}"`}</p>
    </div>
  </div>;
}
