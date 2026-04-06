import { useState } from "react";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {
  title?: string;
  description?: string;
  onProcess: (file: File) => Promise<void>;
};

export default function ResumeUploader({
  title = "Upload Document",
  description = "Supported format: PDF (Max 5MB)",
  onProcess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF resume only.",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      await onProcess(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <label htmlFor="resume-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
            {!file ? (
              <>
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop your resume here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium mb-2">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            )}
          </div>

          <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
        </label>

        {file && !isProcessing && (
          <Button className="w-full mt-4 gradient-primary text-white" onClick={handleProcess}>
            Process Resume
          </Button>
        )}

        {isProcessing && (
          <div className="mt-6 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">AI is analyzing your resume...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
