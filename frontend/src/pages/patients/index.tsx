import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";
import { Patient } from "@models/patient";
import { newResource, Resource } from "@models/resource";
import { Pagination } from "@components/Pagination";
import { PatientList } from "@components/Patient";
import ToastComponent from "@components/Toast";
import { useUser } from "@context/userContext";
import { PostBody } from "@config/constant";

const patientListURL = `${process.env.NEXT_PUBLIC_BASE_API}patient` || "";
const initResource = newResource([], 0, 1, 20);

const Patients = () => {
  const { user } = useUser();
  const router = useRouter();

  const [msg, setMsg] = useState("");
  const [udpated, setUpdated] = useState(false);
  const [patientResource, setPatientResource] =
    useState<Resource<Patient>>(initResource);

  useEffect(() => {
    async function getList() {
      let page = 1;
      if (router.query?.page && typeof router.query.page === "string") {
        page = parseInt(router.query.page, 10);
      }

      let perPage = 20;
      if (router.query?.per_page && typeof router.query.per_page === "string") {
        perPage = parseInt(router.query.per_page.toString(), 10);
      }

      let sort = "id";
      if (router.query?.sort && typeof router.query.sort === "string") {
        sort = router.query.sort;
      }

      let order = "asc";
      if (router.query?.order && typeof router.query.order === "string") {
        order = router.query.order;
      }

      const params = {
        page,
        limit: perPage,
        populate: sort,
        sortBy: order,
      };

      try {
        const { data: respInfo } = await axios.get(patientListURL, {
          params,
          headers: {
            Authorization: user.token,
          },
        });

        setMsg(respInfo.error);
        if (respInfo.error.length === 0) {
          const patientList = respInfo.data.patients;
          const patResource: Resource<Patient> = newResource(
            patientList.results,
            patientList.totalResults,
            Number(patientList.page),
            Number(patientList.limit)
          );

          setPatientResource(patResource);
        }
      } catch (err: any) {
        setMsg(
          err.response.data ? err.response.data.error : "Unexpected error!"
        );
      }
    }

    if (user && user.token.length > 0) {
      if (!user.isAdmin && !user.access.read) {
        setMsg("You don't have right to see patinets list.");
      } else {
        getList();
      }
    }
  }, [user, udpated]);

  const delItem = async (patientId: string) => {
    if (user.isAdmin || user.access.delete) {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}patient/remove`,
        {
          method: "DELETE",
          headers: {
            ...PostBody,
            Authorization: user.token,
          },
          body: JSON.stringify({ patientId }),
        }
      );

      const respBody = await resp.json();

      setMsg(respBody.error);
      if (respBody.error.length === 0) setUpdated(!udpated);
    } else {
      setMsg("You don't have access to delete the patient");
    }
  };

  return (
    <AdminLayout>
      <ToastComponent msg={msg} setMsg={setMsg} />
      <Card>
        <Card.Header>Patients</Card.Header>
        <Card.Body>
          <Pagination meta={patientResource.meta} />
          <PatientList delItem={delItem} patients={patientResource.data} />
          <Pagination meta={patientResource.meta} />
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Patients;
