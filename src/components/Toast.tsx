import ToastPackage, { ToastType } from "../types/ToastType";

export default function Toast({ toast }: { toast: ToastPackage }) {
    return (
        <div className={`toast-item toast-level-${toast.type.toLowerCase()}`}>
            {toast.content}
        </div>
    )
}