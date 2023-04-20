import { NextPage } from "next";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useRouter } from "next/router";
import { SyntheticEvent, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { PostBody } from "../config/constant";
import ToastComponent from "@components/Toast";

const Register: NextPage = () => {
  const router = useRouter();

  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({
    username: "",
    userpass: "",
    usermail: "",
    passconf: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getRedirect = () => {
    const redirect = getCookie("redirect");
    if (redirect) {
      deleteCookie("redirect");
      return redirect.toString();
    }

    return "/";
  };

  const register = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setSubmitting(true);

    const { username, userpass, usermail, passconf } = user;
    if (userpass === passconf && userpass.length >= 8) {
      if (username.length > 0 && usermail.length > 0) {
        const res = await fetch("api/register", {
          method: "POST",
          headers: PostBody,
          body: JSON.stringify({
            username,
            userpass,
            usermail,
          }),
        });
        const resp = await res.json();
        setMsg(resp.errMsg);

        if (resp.errMsg.length === 0) router.push(getRedirect());
      } else {
        setMsg("Please insert username and email");
      }
    } else if (userpass.length < 8) {
      setMsg("password must be at least 8 characters");
    } else {
      setMsg("password not matched");
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <ToastComponent msg={msg} setMsg={setMsg} />
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="mb-4 rounded-0">
              <Card.Body className="p-4">
                <h1>Register</h1>
                <p className="text-black-50">Create your account</p>

                <form onSubmit={register}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} fixedWidth />
                    </InputGroup.Text>
                    <Form.Control
                      name="username"
                      required
                      disabled={submitting}
                      placeholder="Username"
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
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
                      placeholder="Email"
                      value={user.usermail}
                      onChange={(e) =>
                        setUser({ ...user, usermail: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faLock} fixedWidth />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      disabled={submitting}
                      placeholder="Password"
                      value={user.userpass}
                      onChange={(e) =>
                        setUser({ ...user, userpass: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faLock} fixedWidth />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password_repeat"
                      required
                      disabled={submitting}
                      value={user.passconf}
                      placeholder="Repeat password"
                      onChange={(e) =>
                        setUser({ ...user, passconf: e.target.value })
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
                    Create Account
                  </Button>
                  <p className="text-black-50 mt-3">
                    Already have account? Go to <Link href="/login">Login</Link>
                  </p>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
