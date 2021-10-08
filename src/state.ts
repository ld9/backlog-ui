import { createGlobalState } from 'react-hooks-global-state';
import { blankStage } from './types/StageType';
import ToastPackage from './types/ToastType';


export const blankUser = {
    name: {
        first: '',
        last: ''
    },
    recent: {
        audio: [],
        video: []
    },
    permissions: {
        user: {
            admin: false,
            paid: false,
            verified: false
        },
        media: [],
        collection: []
    }
}

let blankToasts: Array<ToastPackage> = [];

export const { useGlobalState } = createGlobalState({
    theme: localStorage.getItem("theme") || "bushido",
    font: "Roboto Mono",
    fontSize: localStorage.getItem("fontSize") || "1.25",
    tokenExpire: localStorage.getItem("user-token-expire"),
    token: localStorage.getItem("user-token"),
    stage: blankStage,
    user: blankUser,
    toasts: blankToasts,
    showCatalog: false,
    isRemote: false
});
