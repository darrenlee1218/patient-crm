import { Toast, ToastContainer } from "react-bootstrap";

type IProp = {
  msg: string;
  setMsg: (val: string) => void;
};

const ToastComponent = ({ msg, setMsg }: IProp) => {
  return (
    <ToastContainer className="p-3" position="bottom-end">
      <Toast
        onClose={() => setMsg("")}
        show={msg.length > 0}
        delay={3000}
        bg="danger"
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Error!</strong>
        </Toast.Header>
        <Toast.Body>{msg}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
