import { IUser, User } from "../models";
import { UserService } from "./user.service";
import { ROLES } from "../config/roles";

/**
 * Get all patients
 */
const getList = async (options) => {
  const patients = await User.paginate({ role: ROLES.PATIENT }, options);
  const respPatients = await Promise.all(
    patients.results.map(async (patient: IUser) => {
      if (patient.creator && patient.creator.length > 0) {
        const selUser = await UserService.getUserById(patient.creator);
        patient.creator = selUser ? selUser.username : "N/A";
      }

      return patient;
    })
  );

  patients.results = respPatients;

  return patients;
};

export const PatientService = {
  getList,
};
