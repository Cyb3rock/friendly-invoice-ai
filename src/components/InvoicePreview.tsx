import React from "react";
import ThankYouFooter from "./ThankYouFooter";

// --- Translation & currency helpers ---

const TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  en: {
    invoice: "Invoice",
    po: "PO",
    issue: "Issue",
    due: "Due",
    from: "From",
    billTo: "Bill To",
    description: "Description",
    qty: "Qty",
    rate: "Rate",
    amount: "Amount",
    subtotal: "Subtotal",
    tax: "Tax",
    discount: "Discount",
    total: "Total",
    paymentDue: "Payment Due:",
    paymentMethods: "Payment Methods:",
    latePenalty: "Late Penalty:",
    payOnline: "Pay online →",
    notes: "Notes:",
    digitalSignature: "Digital Signature",
    noLogo: "No Logo",
    noItems: "No items"
  },
  es: {
    invoice: "Factura",
    po: "OC",
    issue: "Emisión",
    due: "Vencimiento",
    from: "De",
    billTo: "Facturar a",
    description: "Descripción",
    qty: "Cant.",
    rate: "Precio",
    amount: "Importe",
    subtotal: "Subtotal",
    tax: "Impuesto",
    discount: "Descuento",
    total: "Total",
    paymentDue: "Fecha de pago:",
    paymentMethods: "Métodos de pago:",
    latePenalty: "Recargo por demora:",
    payOnline: "Pagar en línea →",
    notes: "Notas:",
    digitalSignature: "Firma digital",
    noLogo: "Sin logo",
    noItems: "Sin artículos"
  },
  fr: {
    invoice: "Facture",
    po: "BC",
    issue: "Émission",
    due: "Échéance",
    from: "De",
    billTo: "Facturer à",
    description: "Désignation",
    qty: "Qté",
    rate: "Prix",
    amount: "Montant",
    subtotal: "Sous-total",
    tax: "Taxe",
    discount: "Remise",
    total: "Total",
    paymentDue: "Date de paiement :",
    paymentMethods: "Moyens de paiement :",
    latePenalty: "Pénalité de retard :",
    payOnline: "Payer en ligne →",
    notes: "Notes :",
    digitalSignature: "Signature numérique",
    noLogo: "Pas de logo",
    noItems: "Aucun article"
  },
  de: {
    invoice: "Rechnung",
    po: "Bestellnr.",
    issue: "Ausgestellt",
    due: "Fällig",
    from: "Von",
    billTo: "Rechnung an",
    description: "Artikel",
    qty: "Menge",
    rate: "Preis",
    amount: "Betrag",
    subtotal: "Zwischensumme",
    tax: "MwSt.",
    discount: "Rabatt",
    total: "Gesamt",
    paymentDue: "Fällig am:",
    paymentMethods: "Zahlungsarten:",
    latePenalty: "Verzugsstrafe:",
    payOnline: "Online zahlen →",
    notes: "Hinweise:",
    digitalSignature: "Digitale Unterschrift",
    noLogo: "Kein Logo",
    noItems: "Keine Artikel"
  },
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
  AED: "د.إ",
  PLN: "zł",
  CHF: "Fr",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  RUB: "₽",
  JPY: "¥",
  KRW: "₩",
  CNY: "¥",
  HKD: "$",
  SGD: "$",
  MYR: "RM",
  IDR: "Rp",
  THB: "฿",
  VND: "₫",
  PHP: "₱",
  BRL: "R$",
  MXN: "$",
  CLP: "$",
  ARS: "$",
  NGN: "₦",
  KES: "KSh",
  ZAR: "R",
  EGP: "E£",
  TRY: "₺",
  ILS: "₪",
  SAR: "﷼",
  QAR: "﷼",
  OMR: "﷼",
  BHD: ".د.ب",
  KWD: "د.ك",
};

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
  digitalSignature?: { type: "drawn"; value: string } | { type: "image"; value: string } | null;
  currency?: string;
  language?: string;
};

type Props = {
  data: InvoiceData;
};

function calcSubtotal(items: InvoiceData["lineItems"]) {
  return items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
}

const InvoicePreview: React.FC<Props> = ({ data }) => {
  const lang = data.language && TRANSLATIONS[data.language] ? data.language : "en";
  const t = TRANSLATIONS[lang];
  const currency = data.currency ?? "USD";
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const subtotal = calcSubtotal(data.lineItems);
  const taxAmount = +(subtotal * (data.taxRate / 100)).toFixed(2);
  const afterTax = subtotal + taxAmount;
  const afterDiscount = Math.max(0, afterTax - data.discount);

  // --- Signature preview logic ---
  let signatureArea: React.ReactNode = null;
  const signature = (data as any).digitalSignature as
    | { type: "drawn"; value: string }
    | { type: "image"; value: string }
    | null
    | undefined;
  if (signature && signature.type === "drawn" && signature.value) {
    signatureArea = (
      <div className="mt-2 flex flex-col items-end pr-2">
        <div
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 32,
            fontWeight: 700,
            color: "#5b4b19",
            borderBottom: "1px dotted #e0c068",
            display: "inline-block",
            minWidth: "160px"
          }}
        >
          {signature.value}
        </div>
        <span className="text-xs text-muted-foreground">{t.digitalSignature}</span>
      </div>
    );
  } else if (signature && signature.type === "image" && signature.value) {
    signatureArea = (
      <div className="mt-2 flex flex-col items-end pr-2">
        <img
          src={signature.value}
          alt="Digital signature"
          className="h-14 object-contain border rounded shadow-sm bg-white"
          style={{ maxWidth: "180px" }}
        />
        <span className="text-xs text-muted-foreground">{t.digitalSignature}</span>
      </div>
    );
  }
  // --- END Signature preview logic ---

  return (
    <div className="font-inter bg-white rounded-2xl border border-border shadow-xl p-8 min-w-[384px] max-w-lg mx-auto mt-4 mb-6">
      {/* Header */}
      <header className="flex items-start justify-between pb-6 border-b border-border mb-4">
        <div>
          <div className="text-2xl font-bold tracking-tighter text-primary">{t.invoice}</div>
          <div className="text-xs text-muted-foreground">
            #{data.invoiceNumber || "0001"}
            {data.poNumber && <span className="ml-4">{t.po}: {data.poNumber}</span>}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t.issue}: {data.issueDate || "--"}
            <span className="ml-3">{t.due}: {data.dueDate || "--"}</span>
          </div>
        </div>
        {data.from.logoUrl ? (
          <img src={data.from.logoUrl} alt="Logo" className="h-12 rounded bg-gray-100 border shadow" />
        ) : (
          <div className="h-12 w-28 flex items-center justify-center bg-gray-100 border rounded text-xs text-muted-foreground font-semibold">{t.noLogo}</div>
        )}
      </header>
      {/* From/To */}
      <div className="flex flex-col md:flex-row justify-between text-xs gap-4 mb-2">
        <div>
          <div className="uppercase font-semibold text-foreground/70 mb-1">{t.from}</div>
          <div className="font-bold">{data.from.company || "--"}</div>
          <div>{data.from.address}</div>
          <div>{data.from.phone}</div>
          <div>{data.from.email}</div>
        </div>
        <div>
          <div className="uppercase font-semibold text-foreground/70 mb-1">{t.billTo}</div>
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
              <th className="text-left font-semibold px-3 py-2 w-1/2">{t.description}</th>
              <th className="text-right font-semibold px-3 py-2">{t.qty}</th>
              <th className="text-right font-semibold px-3 py-2">{t.rate}</th>
              <th className="text-right font-semibold px-3 py-2">{t.amount}</th>
            </tr>
          </thead>
          <tbody>
            {data.lineItems.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted-foreground py-4">
                  <em>{t.noItems}</em>
                </td>
              </tr>
            )}
            {data.lineItems.map((item, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2">{item.description}</td>
                <td className="text-right px-3 py-2">{item.quantity}</td>
                <td className="text-right px-3 py-2">
                  {symbol}
                  {item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="text-right px-3 py-2">
                  {symbol}
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
              <td colSpan={3} className="text-right px-3 py-2">{t.subtotal}</td>
              <td className="text-right px-3 py-2 font-medium">{symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right px-3 py-2">{t.tax} ({data.taxRate}%)</td>
              <td className="text-right px-3 py-2">{symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right px-3 py-2">{t.discount}</td>
              <td className="text-right px-3 py-2">-{symbol}{data.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right px-3 py-2 font-semibold text-primary">{t.total}</td>
              <td className="text-right px-3 py-2 font-bold text-primary text-lg">
                {symbol}{afterDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Payment info */}
      <div className="mt-6 mb-2">
        <div className="flex gap-5 items-center flex-wrap">
          <span className="font-semibold text-sm">{t.paymentDue}</span>
          <span>{data.paymentDue}</span>
        </div>
        <div className="flex gap-2 mt-1 items-center flex-wrap">
          <span className="font-semibold text-sm">{t.paymentMethods}</span>
          <span>{data.paymentMethods}</span>
        </div>
        {data.latePenalty && (
          <div className="text-xs mt-1">
            <span className="font-semibold">{t.latePenalty}</span> {data.latePenalty}
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
              {t.payOnline}
            </a>
          </div>
        )}
      </div>
      {data.notes && (
        <div className="mt-2 border-t border-muted-foreground/10 pt-3 text-sm text-muted-foreground">
          <div className="font-medium text-foreground/80 mb-1">{t.notes}</div>
          <div>{data.notes}</div>
        </div>
      )}
      {/* Footer */}
      <ThankYouFooter
        thankYouMessage={data.thankYouMessage}
        companySlogan={data.companySlogan}
        copyright={data.copyright}
      />

      {/* Digital signature section */}
      {signatureArea}
    </div>
  );
};

export default InvoicePreview;
