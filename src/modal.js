const Modal = ({ visible = false, onClose, children }) => {
  if (!visible) {
    return null;
  }

  return (
    <section
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex: 20,
        overflow: "auto"
      }}
    >
      <section
        style={{
          position: "fixed",
          top: "30%",
          left: "30%",
          right: "30%",
          bottom: "30%",
          zIndex: 20
        }}
      >
        <section
          style={{
            position: "relative",
            top: 0,
            left: 0,
            boxShadow: "0 0 10px 0 #aaaaaa",
            padding: "54px 30px",
            border: "1px solid #EEE",
            borderRadius: 20,
            backgroundColor: "#FFF",
            width: 500,
            height: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {children}
        </section>
        {typeof onClose === "function" && (
          <div
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 27,
              cursor: "pointer",
              fontSize: 21
              // float: "right"
            }}
          >
            &#10006;
          </div>
        )}
      </section>
    </section>
  );
};

export default Modal;
