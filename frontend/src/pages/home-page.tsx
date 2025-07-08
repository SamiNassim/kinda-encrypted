import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="mb-6 flex items-center justify-center">
          <img src="/appicon.png" width={100} height={100} />
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          KindaEncrypted
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Encrypt and decrypt any files with confidence.
        </p>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => navigate("/encrypt")}
            className="w-full rounded-lg text-center font-medium text-white transition duration-200 hover:opacity-80"
          >
            Encrypt Files
          </Button>
          <Button
            onClick={() => navigate("/decrypt")}
            className="w-full rounded-lg bg-gray-200 text-center font-medium text-gray-800 transition duration-200 hover:opacity-80"
          >
            Decrypt Files
          </Button>
        </div>
      </div>

      <div className="px-8 py-4">
        <p className="text-center text-sm text-gray-500">
          Your files never leave your device. All encryption happens locally.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
