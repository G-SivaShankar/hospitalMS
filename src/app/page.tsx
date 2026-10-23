import { Suspense } from "react";
import { connection } from "next/server";
import HospitalApp from "../components/HospitalApp";

async function HospitalAppContent() {
  await connection();
  return <HospitalApp />;
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HospitalAppContent />
    </Suspense>
  );
}