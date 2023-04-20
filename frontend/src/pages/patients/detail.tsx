import { NextPage } from "next";
import { useState, SyntheticEvent, useEffect } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { IPatient, PostBody } from "@config/constant";
import { AdminLayout } from "@layout";
import ToastComponent from "@components/Toast";
import { useUser } from "@context/userContext";

const initValue = {
  username: "",
  usermail: "",
  userphone: "",
};

const PatientDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const [msg, setMsg] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patient, setPatient] = useState<IPatient>(initValue);

  const createAccess = user.isAdmin || user.access.create;
  const updateAccess = user.isAdmin || user.access.update;

  useEffect(() => {
    async function getInfo(userId: string) {
      const { data: respInfo } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}patient/info`,
        {
          params: {
            userId,
          },
          headers: {
            Authorization: user.token,
          },
        }
      );

      setMsg(respInfo.error);
      if (respInfo.error.length === 0) {
        const userInfo = respInfo.data.patient;
        setPatient({
          username: userInfo.username,
          usermail: userInfo.usermail,
          userphone: userInfo.userphone,
        });
      }
    }

    const { patientId } = router.query;
    if (patientId) {
      if (!updateAccess) router.push("/");

      getInfo(patientId.toString());
      setIsUpdate(true);
    } else {
      if (!createAccess) router.push("/");

      setIsUpdate(false);
      setPatient(initValue);
    }
  }, [router]);

  const register = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setSubmitting(true);

    if (!createAccess && !isUpdate) {
      setMsg("You don't have create access");
    } else if (!updateAccess && isUpdate) {
      setMsg("You don't have update access");
    } else {
      const { username, usermail, userphone } = patient;
      if (username.length > 0 && usermail.length > 0 && userphone.length > 0) {
        const reqUrl = isUpdate
          ? `${process.env.NEXT_PUBLIC_BASE_API}patient/update`
          : `${process.env.NEXT_PUBLIC_BASE_API}patient/register`;
        const resp = await fetch(reqUrl, {
          method: "POST",
          headers: {
            ...PostBody,
            Authorization: user.token,
          },
          body: JSON.stringify(
            isUpdate
              ? {
                  ...patient,
                  patientId: router.query.patientId,
                }
              : patient
          ),
        });

        const result = await resp.json();
        setMsg(result.error);

        if (result.error.length === 0) {
          router.push("/patients");
        }
      } else {
        setMsg("Please insert patient info");
      }
    }

    setSubmitting(false);
  };

  return (
    <AdminLayout>
      <ToastComponent msg={msg} setMsg={setMsg} />
      {createAccess && (
        <Card>
          <Card.Header>
            {isUpdate ? "Update Patient" : "Register Patient"}
          </Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={6}>
                <form onSubmit={register}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} fixedWidth />
                    </InputGroup.Text>
                    <Form.Control
                      name="username"
                      required
                      disabled={submitting}
                      placeholder="Patient name"
                      value={patient.username}
                      onChange={(e) =>
                        setPatient({ ...patient, username: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faEnvelope} fixedWidth />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      required
                      disabled={submitting}
                      placeholder="Patient email"
                      value={patient.usermail}
                      onChange={(e) =>
                        setPatient({ ...patient, usermail: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faPhone} fixedWidth />
                    </InputGroup.Text>
                    <Form.Control
                      type="string"
                      name="phone"
                      required
                      disabled={submitting}
                      placeholder="Phone"
                      value={patient.userphone}
                      onChange={(e) =>
                        setPatient({ ...patient, userphone: e.target.value })
                      }
                    />
                  </InputGroup>

                  <Button
                    type="submit"
                    className="d-block w-100"
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
                    {isUpdate ? "Update Patient" : "Create Patient"}
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
              onClick={() => router.push("/patients")}
            >
              Back to list
            </Button>
          </Card.Footer>
        </Card>
      )}
    </AdminLayout>
  );
};

export default PatientDetail;
