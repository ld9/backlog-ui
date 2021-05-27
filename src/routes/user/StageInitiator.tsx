import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useGlobalState } from "../../state";

export default function StageInitiator() {
  let { newStage } = useParams() as {
    newStage: string;
  };

  let history = useHistory();

  let [stage, setStage] = useGlobalState('stage');

  useEffect(() => {
    if (newStage !== "") {
        
        //TODO: look up the stage from the server
        const updatedStage = {
            ...stage,
            name: newStage
        }

        setStage(updatedStage);
        history.replace('/user/stage');

    }
  }, [setStage, newStage, history]);

  return <div>Trying to get you synced up with /{newStage}/...</div>;
}
