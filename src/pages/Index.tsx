
import React from "react";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";

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

const Index = () => {
  const [invoice, setInvoice] = React.useState(initialInvoice);

  return (
    <div className="min-h-screen bg-background font-inter flex flex-col">
      <header className="border-b border-border py-3 px-4 flex items-center gap-3">
        <div className="text-xl font-bold text-primary tracking-tight">AI Invoice Maker</div>
        <span className="text-muted-foreground text-sm font-base ml-3 hidden sm:inline">
          Create clean, professional invoices instantly
        </span>
      </header>
      <main className="flex-1 px-2 md:px-4 xl:px-16 pt-4 pb-6 flex flex-col md:flex-row bg-background gap-8 max-w-[1800px] w-full mx-auto">
        {/* Left: form */}
        <section className="md:w-2/5 w-full bg-card rounded-xl border border-border p-6 mb-4 md:mb-0 shadow-lg min-w-[340px]">
          <InvoiceForm value={invoice} onChange={setInvoice} />
        </section>
        {/* Right: sticky preview */}
        <section className="md:w-3/5 w-full flex flex-col items-center px-1">
          <div className="w-full">
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
