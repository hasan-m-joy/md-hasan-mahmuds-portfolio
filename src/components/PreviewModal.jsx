import { isValidEmbed } from "../utils/validators";

export function PreviewModal({ modalItem, onClose }) {
  return (
    <div
      className={`modal${modalItem ? " show" : ""}`}
      aria-hidden={!modalItem}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-label="Content modal">
        <div className="modal-head">
          <div className="modal-title">{modalItem?.title || "Preview"}</div>
          <button className="modal-close" aria-label="Close modal" type="button" onClick={onClose}>
            x
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-frame">
            {modalItem && isValidEmbed(modalItem.embed) ? (
              <iframe
                title={modalItem.title}
                src={modalItem.embed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                  color: "rgba(255,255,255,0.70)",
                  textAlign: "center",
                }}
              >
                Add a valid YouTube embed link in data-embed (replace VIDEO_ID).
              </div>
            )}
          </div>
          <div className="modal-meta">{modalItem?.meta || ""}</div>
        </div>
      </div>
    </div>
  );
}
