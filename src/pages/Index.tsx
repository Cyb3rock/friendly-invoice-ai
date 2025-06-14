
import React from "react";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";

const initialInvoice = {
  invoiceNumber: "1001",
  issueDate: new Date(),
  dueDate: new Date(),
  poNumber: "",
  from: {
    company: "",
    address: "",
    phone: "",
    email: "",
    logoUrl: null as string | null,
  },
  to: {
    name: "",
    address: "",
    phone: "",
    email: "",
  },
  lineItems: [
    { description: "", quantity: 1, rate: 0 },
  ],
  taxRate: 0,
  discount: 0,
  paymentDue: "",
  paymentMethods: "",
  latePenalty: "",
  notes: "",
  onlinePayment: "",
  thankYouMessage: "Thank you for your business!",
  companySlogan: "",
  copyright: "",
};

const PDF_TARGET_ID = "invoice-preview-panel";

const Index = () => {
  const [invoice, setInvoice] = React.useState(initialInvoice);

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      <header className="border-b border-gray-200 py-3 px-2 sm:px-4 flex items-center gap-3 flex-wrap">
        <div className="text-xl font-bold text-gray-900 tracking-tight">AI Invoice Maker</div>
        <span className="text-gray-500 text-sm font-base ml-3 hidden sm:inline">
          Create clean, professional invoices instantly
        </span>
        <span className="text-gray-400 text-xs font-medium ml-3">
          By Sahil Khatri (SKOP)
        </span>
      </header>
      <main className="flex-1 px-1 sm:px-2 md:px-4 xl:px-16 pt-4 pb-6 flex flex-col md:flex-row bg-white gap-4 md:gap-8 max-w-[1800px] w-full mx-auto">
        {/* Left: form */}
        <section className="w-full md:w-2/5 bg-white rounded-xl border border-gray-200 p-3 xs:p-4 sm:p-6 mb-4 md:mb-0 shadow-lg min-w-0">
          <InvoiceForm value={invoice} onChange={setInvoice} />
        </section>
        {/* Right: sticky preview */}
        <section className="w-full md:w-3/5 flex flex-col items-center px-0 xs:px-1">
          <DownloadInvoiceButton targetId={PDF_TARGET_ID} />
          <div className="w-full" id={PDF_TARGET_ID}>
            <InvoicePreview
              data={{
                ...invoice,
                issueDate: invoice.issueDate
                  ? invoice.issueDate instanceof Date
                    ? invoice.issueDate.toLocaleDateString()
                    : invoice.issueDate
                  : "",
                dueDate: invoice.dueDate
                  ? invoice.dueDate instanceof Date
                    ? invoice.dueDate.toLocaleDateString()
                    : invoice.dueDate
                  : "",
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
