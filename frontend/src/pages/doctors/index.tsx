import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { Card } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";
import { Doctor } from "@models/doctor";
import { newResource, Resource } from "@models/resource";
import { Pagination } from "@components/Pagination";
import { DoctorList } from "@components/Doctor";
import ToastComponent from "@components/Toast";
import { useUser } from "@context/userContext";
import { PostBody } from "@config/constant";

const initResource = newResource([], 0, 1, 20);

const Doctors = () => {
  const { user } = useUser();
  const router = useRouter();

  const [udpated, setUpdated] = useState(false);
  const [msg, setMsg] = useState("");
  const [doctorResource, setDoctorResource] =
    useState<Resource<Doctor>>(initResource);

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
        const { data: respInfo } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API}user/list`,
          {
            params,
            headers: {
              Authorization: user.token,
            },
          }
        );

        setMsg(respInfo.error);
        if (respInfo.error.length === 0) {
          const doctorList = respInfo.data.doctors;
          const doctResource: Resource<Doctor> = newResource(
            doctorList.results,
            doctorList.totalResults,
            Number(doctorList.page),
            Number(doctorList.limit)
          );

          setDoctorResource(doctResource);
        }
      } catch (err: any) {
        setMsg(
          err.response.data ? err.response.data.error : "Unexpected error!"
        );
      }
    }

    if (user) {
      if (user.isAdmin) {
        getList();
      } else {
        setMsg("You don't have right to see doctors list.");
      }
    }
  }, [user, udpated]);

  const delItem = async (doctorId: string) => {
    if (user.isAdmin) {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}user/remove`,
        {
          method: "DELETE",
          headers: {
            ...PostBody,
            Authorization: user.token,
          },
          body: JSON.stringify({ doctorId }),
        }
      );

      const respBody = await resp.json();

      setMsg(respBody.error);
      if (respBody.error.length === 0) setUpdated(!udpated);
    } else {
      setMsg("You are not admin");
    }
  };

  return (
    <AdminLayout>
      <ToastComponent msg={msg} setMsg={setMsg} />
      <Card>
        <Card.Header>Doctors</Card.Header>
        <Card.Body>
          <Pagination meta={doctorResource.meta} />
          <DoctorList delItem={delItem} doctors={doctorResource.data} />
          <Pagination meta={doctorResource.meta} />
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default Doctors;
