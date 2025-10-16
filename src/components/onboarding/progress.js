export const PROGRESS_RANGE = {
  Role: [0, 33],
  AddressKeyword: [33, 66],
  UnitInput: [33, 66],
  Review: [66, 100],

  L_AddressKeyword: [33, 66],
  L_UnitInput: [33, 66],
  L_HouseholdCount: [33, 66],
  L_OwnerDocUpload: [66, 100],
};

export function getProgressRange(step) {
  const [start, end] = PROGRESS_RANGE[step] ?? [0, 100];
  return { start, end };
}
