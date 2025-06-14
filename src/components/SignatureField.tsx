
import React from "react";
import { Upload, Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Ensure Google Fonts (Dancing Script) is available
if (typeof window !== "undefined" && !document.getElementById("signature-handwriting-font")) {
  const link = document.createElement('link');
  link.id = "signature-handwriting-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css?family=Dancing+Script:700";
  document.head.appendChild(link);
}

type SignatureData =
  | { type: "drawn"; value: string; } // text signature
  | { type: "image"; value: string; } // base64 image
  | null;

type SignatureFieldProps = {
  value: SignatureData;
  onChange: (v: SignatureData) => void;
};

const SignatureField: React.FC<SignatureFieldProps> = ({ value, onChange }) => {
  const [mode, setMode] = React.useState<"drawn" | "image">(value?.type || "drawn");
  const [drawnValue, setDrawnValue] = React.useState(value?.type === "drawn" ? value.value : "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle file upload and convert to base64
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ type: "image", value: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  // Update value parent whenever drawnValue changes in drawn mode
  React.useEffect(() => {
    if (mode === "drawn") {
      onChange(drawnValue.trim() ? { type: "drawn", value: drawnValue } : null);
    }
  // disable exhaustive deps on onChange, mode
  // eslint-disable-next-line
  }, [drawnValue]);

  // Mode switch should update parent accordingly
  React.useEffect(() => {
    if (mode === "drawn") {
      onChange(drawnValue.trim() ? { type: "drawn", value: drawnValue } : null);
    } else if (mode === "image") {
      // Do not erase the existing image unless uploading new one
    }
  }, [mode]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Button
          type="button"
          variant={mode === "drawn" ? "default" : "secondary"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setMode("drawn")}
        >
          <Pen className="w-4 h-4" />
          Type signature
        </Button>
        <Button
          type="button"
          variant={mode === "image" ? "default" : "secondary"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setMode("image")}
        >
          <Upload className="w-4 h-4" />
          Upload signature
        </Button>
      </div>
      {mode === "drawn" && (
        <div>
          <label className="text-sm font-medium">Type your name to sign</label>
          <Input
            value={drawnValue}
            placeholder="e.g. John Doe"
            className="mb-2"
            onChange={e => setDrawnValue(e.target.value)}
            maxLength={48}
          />
          {drawnValue.trim() && (
            <div className="mt-1">
              <span
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#5b4b19",
                  display: "inline-block",
                  borderBottom: "1px dotted #e0c068"
                }}
              >
                {drawnValue}
              </span>
              <div className="text-xs text-muted-foreground">Digital signature preview</div>
            </div>
          )}
        </div>
      )}
      {mode === "image" && (
        <div>
          <label className="text-sm font-medium">Upload signature image</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 mb-2 block"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {value?.type === "image" && value.value && (
            <div className="mt-2">
              <img src={value.value} alt="Uploaded signature" className="h-16 object-contain border rounded shadow-sm bg-white" />
              <div className="text-xs text-muted-foreground">Uploaded signature preview</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export type { SignatureData };
export default SignatureField;
