
import React from "react";
import ThankYouFooter from "./ThankYouFooter";

type InvoiceData = {
  invoiceNumber: string;
  issueDate: string; // formatted
  dueDate: string;   // formatted
  poNumber?: string;
  from: {
    company: string;
    address: string;
    phone: string;
    email: string;
    logoUrl: string | null;
  };
  to: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  lineItems: {
    description: string;
    quantity: number;
    rate: number;
  }[];
  taxRate: number;
  discount: number;
  paymentDue: string;
  paymentMethods: string;
  latePenalty: string;
  notes: string;
  onlinePayment: string;
  thankYouMessage: string;
  companySlogan?: string;
  copyright?: string;
};

type Props = {
  data: InvoiceData;
};

function calcSubtotal(items: InvoiceData["lineItems"]) {
  return items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
}

const InvoicePreview: React.FC<Props> = ({ data }) => {
  const subtotal = calcSubtotal(data.lineItems);
  const taxAmount = +(subtotal * (data.taxRate / 100)).toFixed(2);
  const afterTax = subtotal + taxAmount;
  const afterDiscount = Math.max(0, afterTax - data.discount);

  return (
    <div className="font-inter bg-white rounded-2xl border border-border shadow-xl p-8 min-w-[384px] max-w-lg mx-auto mt-4 mb-6">
      {/* Header */}
      <header className="flex items-start justify-between pb-6 border-b border-border mb-4">
        <div>
          <div className="text-2xl font-bold tracking-tighter text-primary">Invoice</div>
          <div className="text-xs text-muted-foreground">
            #{data.invoiceNumber || "0001"}
            {data.poNumber && <span className="ml-4">PO: {data.poNumber}</span>}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Issue: {data.issueDate || "--"}
            <span className="ml-3">Due: {data.dueDate || "--"}</span>
          </div>
        </div>
        {data.from.logoUrl ? (
          <img src={data.from.logoUrl} alt="Logo" className="h-12 rounded bg-gray-100 border shadow" />
        ) : (
          <div className="h-12 w-28 flex items-center justify-center bg-gray-100 border rounded text-xs text-muted-foreground font-semibold">No Logo</div>
        )}
      </header>
      {/* From/To */}
      <div className="flex flex-col md:flex-row justify-between text-xs gap-4 mb-2">
        <div>
          <div className="uppercase font-semibold text-foreground/70 mb-1">From</div>
          <div className="font-bold">{data.from.company || "--"}</div>
          <div>{data.from.address}</div>
          <div>{data.from.phone}</div>
          <div>{data.from.email}</div>
        </div>
        <div>
          <div className="uppercase font-semibold text-foreground/70 mb-1">Bill To</div>
          <div className="font-bold">{data.to.name || "--"}</div>
          <div>{data.to.address}</div>
          <div>{data.to.phone}</div>
          <div>{data.to.email}</div>
        </div>
      </div>
      {/* Items Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border rounded-t overflow-hidden text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left font-semibold px-3 py-2 w-1/2">Description</th>
              <th className="text-right font-semibold px-3 py-2">Qty</th>
              <th className="text-right font-semibold px-3 py-2">Rate</th>
              <th className="text-right font-semibold px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted-foreground py-4">
                  <em>No items</em>
                </td>
              </tr>
            )}
            {data.lineItems.map((item, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2">{item.description}</td>
                <td className="text-right px-3 py-2">{item.quantity}</td>
                <td className="text-right px-3 py-2">{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="text-right px-3 py-2">
                  {(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}><div className="border-b border-border" /></td>
            </tr>
          </tbody>
          <tfoot className="text-base">
            <tr>
              <td colSpan={3} className="text-right px-3 py-2">Subtotal</td>
              <td className="text-right px-3 py-2 font-medium">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right px-3 py-2">Tax ({data.taxRate}%)</td>
              <td className="text-right px-3 py-2">{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right px-3 py-2">Discount</td>
              <td className="text-right px-3 py-2">-{data.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right px-3 py-2 font-semibold text-primary">Total</td>
              <td className="text-right px-3 py-2 font-bold text-primary text-lg">
                {afterDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Payment info */}
      <div className="mt-6 mb-2">
        <div className="flex gap-5 items-center flex-wrap">
          <span className="font-semibold text-sm">Payment Due:</span>
          <span>{data.paymentDue}</span>
        </div>
        <div className="flex gap-2 mt-1 items-center flex-wrap">
          <span className="font-semibold text-sm">Payment Methods:</span>
          <span>{data.paymentMethods}</span>
        </div>
        {data.latePenalty && (
          <div className="text-xs mt-1">
            <span className="font-semibold">Late Penalty:</span> {data.latePenalty}
          </div>
        )}
        {data.onlinePayment && (
          <div className="py-2">
            <a
              href={data.onlinePayment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-medium text-primary underline hover:text-blue-500 transition"
            >
              Pay online →
            </a>
          </div>
        )}
      </div>
      {data.notes && (
        <div className="mt-2 border-t border-muted-foreground/10 pt-3 text-sm text-muted-foreground">
          <div className="font-medium text-foreground/80 mb-1">Notes:</div>
          <div>{data.notes}</div>
        </div>
      )}
      {/* Footer */}
      <ThankYouFooter
        thankYouMessage={data.thankYouMessage}
        companySlogan={data.companySlogan}
        copyright={data.copyright}
      />
    </div>
  );
};

export default InvoicePreview;
