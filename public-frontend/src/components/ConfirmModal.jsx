import { useEffect } from "react";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
}) {
  // ✅ Hooks must run unconditionally
  useEffect(() => {
    if (!open) return;                 // do nothing when closed
    function onKeyDown(e) {
      if (e.key === "Escape" && !busy) onCancel?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onCancel]);

  // Render nothing when closed (this is fine AFTER hooks)
  if (!open) return null;

  function onBackdrop(e) {
    if (e.target === e.currentTarget && !busy) onCancel?.();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center px-4"
      onClick={onBackdrop}
    >
      <div className="w-full max-w-md card p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {message && <p className="text-gray-600 mt-2">{message}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="btn btn-outline w-full"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`btn w-full ${busy ? "btn-outline cursor-wait" : "btn-primary"}`}
          >
            {busy ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
