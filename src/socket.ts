import { io } from "socket.io-client";
import { BASE_CONTENT_URL } from "./variables";

export const socket = io(BASE_CONTENT_URL);

socket.on('connect', () => {
    "connected to socket"
})

export const subscribe = (message: string, callback: any) => {
    socket.on(message, callback);
};

export const watchForResponse = async (watch: string): Promise<any> => {
    // console.log('---watching');

    let promise = await new Promise((resolve, reject) => {
        socket.on(watch, (res) => {
            // console.log('---on-requestSubbed');
            resolve(res);
        });
    })

    return promise;

}


socket.on('inform-join', (res) => {
    // console.log('got a join res', res);
})
