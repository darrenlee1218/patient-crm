import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { AdminLayout } from "@layout";
import { Card } from "react-bootstrap";
import { useUser } from "@context/userContext";

const Home: NextPage = () => {
  const { user } = useUser();

  const [doctorCnt, setDoctorCnt] = useState("");
  const [patientCnt, setPatientCnt] = useState("");

  useEffect(() => {
    async function getInfo() {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}user`, {
        method: "GET",
        headers: {
          Authorization: user.token,
        },
      });

      const respInfo = await resp.json();
      if (respInfo.error.length === 0) {
        const cntInfo = respInfo.data;

        setDoctorCnt(cntInfo.doctorCnt);
        setPatientCnt(cntInfo.patientCnt);
      }
    }

    getInfo();
  }, []);

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-sm-6 col-lg-3">
          <Card bg="primary" text="white" className="mb-4">
            <Card.Body className="pb-3 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{doctorCnt}</div>
                <div>Doctors</div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-sm-6 col-lg-3">
          <Card bg="warning" text="white" className="mb-4">
            <Card.Body className="pb-3 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">{patientCnt}</div>
                <div>Patients</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Home;
