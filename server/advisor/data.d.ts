import { PredictionData, Sex, SymptomLevel } from "../graphql/resolvers.gen";

const dataFieldSex: { M: 0; F: 1 };
export type DataFieldRawSex<S extends Sex = Sex> = typeof dataFieldSex[S];

const dataFieldLevel: { NEVER: 0; LITTLE: 1; SOME: 2; SEVERE: 3 };
export type DataFieldRawLevel<L extends SymptomLevel = SymptomLevel> =
  typeof dataFieldLevel[L];

type DataFieldRawBoolean<V extends boolean = boolean> = V extends true ? 1 : 0;

type RawTypeMapper<T extends Record<string, any>> = {
  [P in keyof T]: T[P] extends boolean
    ? DataFieldRawBoolean
    : T[P] extends Sex
    ? DataFieldRawSex<T[P]>
    : T[P] extends SymptomLevel
    ? DataFieldRawLevel<T[P]>
    : T[P];
};

export type RawDataEntry = RawTypeMapper<PredictionData>;

export interface TrainingDataEntry extends RawDataEntry {
  target: DataFieldRawBoolean;
}
