export type SectionCode = "A" | "B" | "C" | "D";

export interface StudentListItem {
  _id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  classLabel: string; // e.g., "Seven-A"
  phone?: string;     // guardian phone
  createdAt?: Date;
}