import { useEffect, useState, SyntheticEvent } from "react";
import { NextPage } from "next";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  InputGroup,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useRouter } from "next/router";
import { AdminLayout } from "@layout";
import ToastComponent from "@components/Toast";
import { useUser } from "@context/userContext";
import { PostBody, UserAccess } from "@config/constant";

const DoctorAccess: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [right, setRight] = useState({
    [UserAccess.CREATE]: false,
    [UserAccess.READ]: false,
    [UserAccess.UPDATE]: false,
    [UserAccess.DELETE]: false,
  });

  useEffect(() => {
    async function getAccess(doctorId: string) {
      const { data: respInfo } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}user/access`,
        {
          params: {
            userId: doctorId,
          },
          headers: {
            Authorization: user.token,
          },
        }
      );

      setMsg(respInfo.error);
      if (respInfo.error.length === 0) {
        const accessList = respInfo.data.access;
        const accessVal = {
          [UserAccess.CREATE]:
            accessList.indexOf(UserAccess.CREATE) >= 0 ? true : false,
          [UserAccess.READ]:
            accessList.indexOf(UserAccess.READ) >= 0 ? true : false,
          [UserAccess.UPDATE]:
            accessList.indexOf(UserAccess.UPDATE) >= 0 ? true : false,
          [UserAccess.DELETE]:
            accessList.indexOf(UserAccess.DELETE) >= 0 ? true : false,
        };

        setRight(accessVal);
      }
    }

    const { doctorId } = router.query;
    if (doctorId) getAccess(doctorId.toString());
  }, [user]);

  const register = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setSubmitting(true);

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}user/update-access`,
      {
        method: "POST",
        headers: { ...PostBody, Authorization: user.token },
        body: JSON.stringify({ ...right, userId: router.query.doctorId }),
      }
    );

    const result = await resp.json();
    setMsg(result.error);

    if (result.error.length === 0) router.push("/doctors");

    setSubmitting(false);
  };

  return (
    <AdminLayout>
      <ToastComponent msg={msg} setMsg={setMsg} />
      {user.isAdmin && (
        <Card>
          <Card.Header>Manage Access</Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={6}>
                <form onSubmit={register}>
                  <InputGroup className="mb-3">
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="create-switch"
                      label="Create"
                      checked={right.create}
                      onChange={() =>
                        setRight({ ...right, create: !right.create })
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="read-switch"
                      label="Read"
                      checked={right.read}
                      onChange={() => setRight({ ...right, read: !right.read })}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="update-switch"
                      label="Update"
                      checked={right.update}
                      onChange={() =>
                        setRight({ ...right, update: !right.update })
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Check // prettier-ignore
                      type="switch"
                      id="delete-switch"
                      label="Delete"
                      checked={right.delete}
                      onChange={() =>
                        setRight({ ...right, delete: !right.delete })
                      }
                    />
                  </InputGroup>

                  <Button
                    type="submit"
                    className="d-block"
                    disabled={submitting}
                    variant="success"
                  >
                    {submitting && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Update Access
                  </Button>
                </form>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button
              className="d-block"
              disabled={submitting}
              variant="danger"
              onClick={() => router.push("/doctors")}
            >
              Back to list
            </Button>
          </Card.Footer>
        </Card>
      )}
    </AdminLayout>
  );
};

export default DoctorAccess;
