import MapDrawer from "@/components/map-drawer";
import { useLocation } from "@/lib/hooks/location";
import { useProofGeneration } from "@/lib/hooks/proof-generation";
import ProofCard from "@/components/proof-card";
import { useState } from "react";
import { VerifierCard } from "./components/verifier-card";

export default function App() {
  const [input, setInput] = useState<{ [key: string]: number } | undefined>();
  const { proofData } = useProofGeneration(input);
  const { longitude, latitude } = useLocation();

  const [coordinates, setCoordinates] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  const handleDraw = (coordinates: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }) => {
    setCoordinates(coordinates);
  };

  const handleProve = async () => {
    if (!coordinates) {
      alert("Please draw a rectangle");
      return;
    }

    const input = {
      ...coordinates,
      x: longitude!,
      y: latitude!,
    };

    setInput(input);
  };

  return (
    <div className="py-10 mx-auto mt-10 border rounded-lg shadow-lg max-w-prose border-battleshipGray">
      <header className="flex flex-col items-center text-center gap-4 [&_*]:px-8">
        <h1 className="text-4xl font-bold">ZK Location</h1>
        <span>
          Prove you are in a specific region without revealing your location.
        </span>
      </header>

      <hr className="my-8 border-battleshipGray" />

      <h2 className="text-2xl font-bold text-center">Prover</h2>
      <div className="px-4 mt-8">
        <MapDrawer onDraw={handleDraw} />
      </div>

      {/* Prove */}
      <div className="flex justify-center px-4 mt-8">
        <button
          className="px-4 py-2 text-white rounded-md bg-battleshipGray"
          onClick={handleProve}
        >
          Generate Proof
        </button>
      </div>
      {proofData && <ProofCard proofData={proofData} />}

      <hr className="my-8 border-battleshipGray" />
      <VerifierCard />
    </div>
  );
}
