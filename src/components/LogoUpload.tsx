
import React from "react";
import { Button } from "@/components/ui/button";

export type LogoUploadProps = {
  logoUrl: string | null;
  onLogoChange: (logo: string | null) => void;
};

const LogoUpload: React.FC<LogoUploadProps> = ({ logoUrl, onLogoChange }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        if (typeof ev.target?.result === "string") {
          onLogoChange(ev.target.result);
        } else {
          onLogoChange(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="flex items-center gap-3">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo preview"
            className="h-14 w-auto rounded shadow border bg-white object-contain"
          />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          {logoUrl ? "Replace Logo" : "Upload Logo"}
        </Button>
        {logoUrl && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onLogoChange(null)}>
            Remove
          </Button>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

export default LogoUpload;
