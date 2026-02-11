export const BodyType = {
  ECTOMORPH: "ECTOMORPH",
  MESOMORPH: "MESOMORPH",
  ENDOMORPH: "ENDOMORPH",
} as const;

export type BodyType = (typeof BodyType)[keyof typeof BodyType];

export const bodyTypeLabels: Record<BodyType, string> = {
  [BodyType.ECTOMORPH]: "Ectomorfo",
  [BodyType.MESOMORPH]: "Mesomorfo",
  [BodyType.ENDOMORPH]: "Endomorfo",
};
