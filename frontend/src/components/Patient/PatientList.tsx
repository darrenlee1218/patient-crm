import React from "react";
import { Dropdown, Table } from "react-bootstrap";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { Patient } from "@models/patient";
import { THSort } from "@components/TableSort";

type Props = {
  patients: Patient[];
  delItem: (patientId: string) => void;
} & Pick<Parameters<typeof THSort>[0], "setSort" | "setOrder">;

export default function PatientList(props: Props) {
  const { patients, setSort, setOrder, delItem } = props;

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
          <th className="text-end">
            <THSort name="userphone" setSort={setSort} setOrder={setOrder}>
              Phone Number
            </THSort>
          </th>
          <th className="text-end">
            <THSort name="creator" setSort={setSort} setOrder={setOrder}>
              Creator
            </THSort>
          </th>
          <th aria-label="Action" />
        </tr>
      </thead>
      <tbody>
        {patients.map((patient, ind) => (
          <tr key={patient.id}>
            <td>{++ind}</td>
            <td>{patient.username}</td>
            <td className="text-end">{patient.usermail}</td>
            <td className="text-end">{patient.userphone}</td>
            <td className="text-end">{patient.creator}</td>
            <td>
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-black-50 shadow-none p-0"
                  id={`action-${patient.id}`}
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      router.push(`/patients/detail?patientId=${patient.id}`)
                    }
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-danger"
                    onClick={() => delItem(patient.id)}
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
