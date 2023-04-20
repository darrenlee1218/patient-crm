import { SyntheticEvent, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { PostBody } from "@config/constant";
import { useUser } from "@context/userContext";
import ToastComponent from "@components/Toast";

const Login: NextPage = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const [msg, setMsg] = useState("");
  const [user, setUserInfo] = useState({
    usermail: "",
    userpass: "",
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

  const login = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setMsg("");

    setSubmitting(true);

    const { usermail, userpass } = user;
    if (usermail.length > 0 && userpass.length > 0) {
      const res = await fetch("api/login", {
        method: "POST",
        headers: PostBody,
        body: JSON.stringify(user),
      });
      const resp = await res.json();
      setMsg(resp.errMsg);

      if (resp.errMsg.length === 0) {
        setUser(resp.userInfo);
        localStorage.setItem("user-info", JSON.stringify(resp.userInfo));
        router.push(getRedirect());
      }
    } else {
      setMsg("Please insert email and password");
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <ToastComponent msg={msg} setMsg={setMsg} />
      <Container>
        <Row className="justify-content-center align-items-center px-3">
          <Col lg={8}>
            <Row>
              <Col md={7} className="bg-white border p-5">
                <div className="">
                  <h1>Login</h1>
                  <p className="text-black-50">Sign In to your account</p>
                  <form onSubmit={login}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} fixedWidth />
                      </InputGroup.Text>
                      <Form.Control
                        name="usermail"
                        type="email"
                        required
                        disabled={submitting}
                        placeholder="Email"
                        value={user.usermail}
                        onChange={(e) =>
                          setUserInfo({ ...user, usermail: e.target.value })
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
                          setUserInfo({ ...user, userpass: e.target.value })
                        }
                      />
                    </InputGroup>

                    <Row>
                      <Col xs={6}>
                        <Button
                          className="px-4"
                          variant="primary"
                          type="submit"
                          disabled={submitting}
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
                          Login
                        </Button>
                      </Col>
                      <Col xs={6} className="text-end">
                        <Button className="px-0" variant="link" type="submit">
                          Forgot password?
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Col>
              <Col
                md={5}
                className="bg-primary text-white d-flex align-items-center justify-content-center p-5"
              >
                <div className="text-center">
                  <h2>Sign up</h2>
                  <Link href="/register">
                    <button
                      className="btn btn-lg btn-outline-light mt-3"
                      type="button"
                    >
                      Register Now!
                    </button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
