
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type DownloadInvoiceButtonProps = {
  targetId: string;
};

const saveAs = (blobOrData: Blob | string, filename: string) => {
  const link = document.createElement("a");
  if (blobOrData instanceof Blob) {
    link.href = URL.createObjectURL(blobOrData);
  } else {
    link.href = blobOrData;
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DownloadInvoiceButton: React.FC<DownloadInvoiceButtonProps> = ({ targetId }) => {
  const [open, setOpen] = React.useState(false);

  // Constants for A4 size in points and pixels
  const A4_WIDTH_PT = 595.28; // 210mm in points at 72 DPI
  const A4_HEIGHT_PT = 841.89; // 297mm in points at 72 DPI
  const MM_TO_PX = (mm: number, dpi = 96) => Math.round((mm / 25.4) * dpi);
  // At 96dpi: 210mm ≈ 794px, 297mm ≈ 1123px
  const A4_WIDTH_PX = MM_TO_PX(210, 144); // 1191px at 144dpi for better sharpness
  const A4_HEIGHT_PX = MM_TO_PX(297, 144); // 1684px at 144dpi

  // --- PDF: Render DOM to PNG at fixed A4 size, then use jsPDF for A4 page ---
  const handleDownloadPDF = async () => {
    const invoiceNode = document.getElementById(targetId);
    if (!invoiceNode) return;
    // Use html2canvas with fixed A4 size and higher DPI for clarity
    const canvas = await html2canvas(invoiceNode as HTMLElement, {
      backgroundColor: "#fff",
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      scale: 1,
      windowWidth: invoiceNode.scrollWidth,
      windowHeight: invoiceNode.scrollHeight,
      // Letterboxing to fit the aspect if needed
    });

    // Resize logic: ensure image is A4 in PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Always fit image to page exactly
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      A4_WIDTH_PT,
      A4_HEIGHT_PT
    );
    pdf.save("invoice.pdf");
    setOpen(false);
  };

  const handleDownloadSVG = () => {
    const invoiceNode = document.getElementById(targetId);
    if (!invoiceNode) return;
    const svg = invoiceNode.querySelector("svg");
    if (svg) {
      const svgBlob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
      saveAs(svgBlob, "invoice.svg");
    } else {
      const serializer = new XMLSerializer();
      const html = serializer.serializeToString(invoiceNode);
      const width = invoiceNode.offsetWidth;
      const height = invoiceNode.offsetHeight;
      const svgMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            ${html}
          </foreignObject>
        </svg>
      `;
      const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      saveAs(svgBlob, "invoice.svg");
    }
    setOpen(false);
  };

  return (
    <div className="relative mb-3 flex justify-end w-full">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(open => !open)}
        className="flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Download Invoice"
      >
        <Download className="w-4 h-4 mr-1" /> Download
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 z-50 min-w-[140px] bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <button
            className="w-full text-left px-4 py-2 hover:bg-muted/40 text-base flex gap-3 items-center"
            onClick={handleDownloadPDF}
          >
            PDF
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-muted/40 text-base flex gap-3 items-center"
            onClick={handleDownloadSVG}
          >
            SVG
          </button>
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default DownloadInvoiceButton;
