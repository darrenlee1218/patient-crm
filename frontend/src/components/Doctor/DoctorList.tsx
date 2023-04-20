import React from "react";
import { Dropdown, Table } from "react-bootstrap";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Doctor } from "@models/doctor";
import { THSort } from "@components/TableSort";

type Props = {
  doctors: Doctor[];
  delItem: (doctorId: string) => void;
} & Pick<Parameters<typeof THSort>[0], "setSort" | "setOrder">;

export default function DoctorList(props: Props) {
  const { doctors, setSort, setOrder, delItem } = props;

  const router = useRouter();

  return (
    <Table responsive bordered hover>
      <thead className="bg-light">
        <tr>
          <th>
            <THSort name="id" setSort={setSort} setOrder={setOrder}>
              #
            </THSort>
          </th>
          <th>
            <THSort name="username" setSort={setSort} setOrder={setOrder}>
              Name
            </THSort>
          </th>
          <th className="text-end">
            <THSort name="usermail" setSort={setSort} setOrder={setOrder}>
              Email
            </THSort>
          </th>
          <th aria-label="Action" />
        </tr>
      </thead>
      <tbody>
        {doctors.map((doctor, ind) => (
          <tr key={doctor.id}>
            <td>{++ind}</td>
            <td>{doctor.username}</td>
            <td className="text-end">{doctor.usermail}</td>
            <td>
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-black-50 shadow-none p-0"
                  id={`action-${doctor.id}`}
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => router.push(`/doctors/access?doctorId=${doctor.id}`)}>
                    Manage Access
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-danger"
                    onClick={() => delItem(doctor.id)}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
