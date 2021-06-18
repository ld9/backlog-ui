import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket, subscribe } from "../socket";

export default function SocketTest() {
  const [room, setRoom] = useState("Not in a room.");
  const [log, setLog] = useState([{}]);

  // socket.on("inform-peer", (info) => {
  //   let t = log;
  //   t.push(JSON.parse(info));

  //   setLog(t);

  //   console.log(log);
  // });

  // socket.on("inform-join", (info) => {
  //   const ji = JSON.parse(info);
  //   setRoom(ji.room);
  // });

  subscribe('inform-join', function (info: any) {
    info = JSON.parse(info);
    
    if (info.user === socket.id) {
      setRoom(info.room);
    }
  })

  // subscribe('inform-peer', function (res: any) {
  //   console.log(res);
  //   setLog([
  //     ...log,
  //     JSON.parse(res)
  //   ])
  // })

  function joinRoom() {
    socket.emit("request-join", "test");
  }

  // function emitTest() {
  //   socket.emit(
  //     "inform-peer",
  //     JSON.stringify({
  //       from: 22001,
  //       type: "SYNC",
  //       data: {
  //         time: 123111,
  //       },
  //     })
  //   );
  // }

  return (
    <div>
      <div id="info">{room}</div>
      <div id="controls">
        <button onClick={joinRoom}>Join room 'test'</button>
        {/* <button onClick={emitTest}>Emit message</button> */}
      </div>
      <div>
        { log.toString() }
      </div>
    </div>
  );
}
