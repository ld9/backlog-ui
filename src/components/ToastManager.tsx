import { useEffect, useState } from "react";
import { useGlobalState } from "../state";
import { ToastType } from "../types/ToastType";

import "../styles/toasts.css"
import Toast from "./Toast";

export default function ToastManager() {
  const [toasts, setToasts] = useGlobalState("toasts");

  const [dummy, setDummy] = useState(1);

  useEffect(() => {
    if (toasts.length > 0) {
      setTimeout(() => {
        setDummy(Math.random());
      }, toasts[toasts.length - 1].until - Date.now());
    }
  }, [toasts]);

  return (
    <div id="toast-container">
      {toasts
        .filter((toast) => {
          return toast.until > Date.now();
        })
        .map((toast, idx) => {
          return <Toast toast={toast} key={idx} ></Toast>;
        })}
    </div>
  );
}
