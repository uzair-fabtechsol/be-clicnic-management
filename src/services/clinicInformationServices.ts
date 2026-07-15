import ClinicInformationModel from "@src/models/clinicInformationModel";
import type { UpdateClinicInformationBody } from "@src/types/clinicInformationTypes";

const updateClinicInformationService = async (
  body: UpdateClinicInformationBody
) => {
  const clinicInformation = await ClinicInformationModel.findOneAndUpdate(
    {},
    body,
    { new: true, upsert: true, runValidators: true }
  );

  return { clinicInformation };
};

export { updateClinicInformationService };
