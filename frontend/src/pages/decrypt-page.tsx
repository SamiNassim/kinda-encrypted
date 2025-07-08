import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EncryptionService } from "../../bindings/changeme";
import { ArrowLeft, Unlock, Upload, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DecryptPage = () => {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const [outputPath, setOutputPath] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const getFilePath = async () => {
    const path = await EncryptionService.GetFilePath();
    setFilePath(path);
  };

  const getOutputPath = async () => {
    const path = await EncryptionService.GetOutputPath();
    setOutputPath(path);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    if (!filePath) {
      EncryptionService.NewDialog("Error", "Please select a file.");
      return;
    }
    if (filePath && !outputPath) {
      EncryptionService.NewDialog("Error", "Please select the output folder.");
      return;
    }
    if (filePath && outputPath && !password) {
      EncryptionService.NewDialog("Error", "Please enter the password.");
      return;
    }
    if (filePath && outputPath && password) {
      EncryptionService.DecryptFileAES256GCM(password, filePath, outputPath);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="min-w-96">
        <div className="mb-6 flex items-center">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-default items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Decrypt Your Files
        </h1>
        <p className="mb-6 text-gray-600">Select files to decrypt.</p>

        {!filePath ? (
          <div className="mb-6 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
            <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              Drag and drop files here, or
            </p>
            <Button
              onClick={getFilePath}
              className="rounded-lg text-white transition duration-200 hover:opacity-80"
            >
              Browse Files
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2">
              <Input value={filePath} disabled />
              <X
                onClick={() => {
                  setFilePath(undefined);
                  setOutputPath(undefined);
                }}
              />
            </div>
            {!outputPath ? (
              <Button onClick={getOutputPath}>Select the output path</Button>
            ) : (
              <div className="flex flex-row items-center gap-2">
                <Input value={outputPath} disabled />
                <X onClick={() => setOutputPath(undefined)} />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 py-4">
          <Label>Password</Label>
          <Input onChange={handlePasswordChange} type="password" />
        </div>
        <Button
          onClick={handleSubmit}
          className="flex w-full items-center justify-center rounded-lg text-center font-medium text-white transition duration-200 hover:opacity-80"
        >
          <Unlock className="mr-2 h-5 w-5" />
          Decrypt Files
        </Button>
      </div>
    </div>
  );
};

export default DecryptPage;
