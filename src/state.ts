import { createGlobalState } from 'react-hooks-global-state';

export const { useGlobalState } = createGlobalState({
    theme: localStorage.getItem("theme") || "bushido",
    font: "Roboto Mono",
    fontSize: localStorage.getItem("fontSize") || "1.25",
    tokenExpire: localStorage.getItem("user-token-expire"),
    token: localStorage.getItem("user-token"),
});
