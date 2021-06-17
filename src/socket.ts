import { io } from "socket.io-client";

export const socket = io("http://localhost:7000");

socket.on('connect', () => {
    "connected to socket"
})

export const subscribe = (message: string, callback: any) => {
    socket.on(message, callback);
};

export const watchForResponse = async (watch: string): Promise<any> => {
    console.log('---watching');

    let promise = await new Promise((resolve, reject) => {
        socket.on(watch, (res) => {
            console.log('---on-requestSubbed');
            resolve(res);
        });
    })

    return promise;

}


socket.on('inform-join', (res) => {
    console.log(res);
})
