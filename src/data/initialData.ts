import type { HospitalData } from "../types/hospital";

export const initialData: HospitalData = {
  patients: [
    {
      id: "P001",
      name: "Arun Kumar",
      age: 28,
      gender: "Male",
      phone: "9000000001",
      email: "arun@example.com",
    },
    {
      id: "P002",
      name: "Priya Devi",
      age: 34,
      gender: "Female",
      phone: "9000000002",
      email: "priya@example.com",
    },
  ],

  doctors: [
    {
      id: "D001",
      name: "Dr. Kumar",
      specialty: "Cardiology",
      phone: "9000000011",
      available: "Yes",
    },
    {
      id: "D002",
      name: "Dr. Meena",
      specialty: "Pediatrics",
      phone: "9000000012",
      available: "Yes",
    },
  ],

  appointments: [
    {
      id: "A001",
      patient: "Arun Kumar",
      doctor: "Dr. Kumar",
      date: "2026-11-01",
      status: "Scheduled",
    },
  ],

  billing: [
    {
      id: "B001",
      patient: "Arun Kumar",
      amount: 1500,
      status: "Paid",
    },
    {
      id: "B002",
      patient: "Priya Devi",
      amount: 800,
      status: "Pending",
    },
  ],

  beds: [
    {
      id: "BED001",
      ward: "General",
      bedNumber: "G-01",
      status: "Available",
    },
    {
      id: "BED002",
      ward: "General",
      bedNumber: "G-02",
      status: "Occupied",
    },
  ],
};