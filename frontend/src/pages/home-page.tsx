import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className="mb-6 flex items-center justify-center">
          <div className="bg-primary rounded-full p-3">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          KindaEncrypted
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Encrypt and decrypt any files with confidence.
        </p>

        <div className="flex flex-col gap-4">
          <Link to="/encrypt">
            <Button className="w-full rounded-lg text-center font-medium text-white transition duration-200 hover:opacity-80">
              Encrypt Files
            </Button>
          </Link>
          <Link to="/decrypt">
            <Button className="w-full rounded-lg bg-gray-200 text-center font-medium text-gray-800 transition duration-200 hover:opacity-80">
              Decrypt Files
            </Button>
          </Link>
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
