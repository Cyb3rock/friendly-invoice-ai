import React from "react";
import InvoiceLineItemRow from "./InvoiceLineItemRow";
import LogoUpload from "./LogoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Link, Mail, PenLine } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SignatureField, { SignatureData } from "./SignatureField";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CURRENCIES: { code: string; symbol: string; name: string }[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee (India)" },
  { code: "USD", symbol: "$", name: "US Dollar (United States)" },
  { code: "GBP", symbol: "£", name: "British Pound (United Kingdom)" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar (Australia)" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar (Canada)" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham (United Arab Emirates)" },
  { code: "EUR", symbol: "€", name: "Euro (Germany, France, Spain, Italy, Netherlands, Belgium)" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty (Poland)" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc (Switzerland)" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona (Sweden)" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone (Norway)" },
  { code: "DKK", symbol: "kr", name: "Danish Krone (Denmark)" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble (Russia)" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen (Japan)" },
  { code: "KRW", symbol: "₩", name: "South Korean Won (South Korea)" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan (China)" },
  { code: "HKD", symbol: "$", name: "Hong Kong Dollar (Hong Kong)" },
  { code: "SGD", symbol: "$", name: "Singapore Dollar (Singapore)" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit (Malaysia)" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah (Indonesia)" },
  { code: "THB", symbol: "฿", name: "Thai Baht (Thailand)" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong (Vietnam)" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso (Philippines)" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real (Brazil)" },
  { code: "MXN", symbol: "$", name: "Mexican Peso (Mexico)" },
  { code: "CLP", symbol: "$", name: "Chilean Peso (Chile)" },
  { code: "ARS", symbol: "$", name: "Argentine Peso (Argentina)" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira (Nigeria)" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling (Kenya)" },
  { code: "ZAR", symbol: "R", name: "South African Rand (South Africa)" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound (Egypt)" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira (Turkey)" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel (Israel)" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal (Saudi Arabia)" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal (Qatar)" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial (Oman)" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar (Bahrain)" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar (Kuwait)" },

  // Duplicates for legacy/app stability (old code had some repeated currencies by country)
  { code: "EUR", symbol: "€", name: "Euro (Spain)" },
  { code: "EUR", symbol: "€", name: "Euro (Italy)" },
  { code: "EUR", symbol: "€", name: "Euro (Netherlands)" },
  { code: "EUR", symbol: "€", name: "Euro (Belgium)" },
  // Only display the symbol and code once per code in UI (Select will group by code)
];

const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  // Add more as needed
];

type InvoiceLineItem = {
  description: string;
  quantity: number;
  rate: number;
};

type InvoiceFormProps = {
  value: any;
  onChange: (v: any) => void;
};

function formatDate(date: Date | null) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

const emptyLineItem: InvoiceLineItem = { description: "", quantity: 1, rate: 0 };

const InvoiceForm: React.FC<InvoiceFormProps> = ({ value, onChange }) => {
  // Line Items
  function updateLineItem(idx: number, item: InvoiceLineItem) {
    const items = [...value.lineItems];
    items[idx] = item;
    onChange({ ...value, lineItems: items });
  }
  function removeLineItem(idx: number) {
    if (value.lineItems.length === 1) return; // Prevent removal if only one
    const items = value.lineItems.filter((_, i) => i !== idx);
    onChange({ ...value, lineItems: items });
  }
  function addLineItem() {
    onChange({ ...value, lineItems: [...value.lineItems, { ...emptyLineItem }] });
  }

  function handleSignatureChange(nextSignature: SignatureData) {
    onChange({ ...value, digitalSignature: nextSignature });
  }

  // Date pickers
  const [showIssuePicker, setShowIssuePicker] = React.useState(false);
  const [showDuePicker, setShowDuePicker] = React.useState(false);

  // Currency and Language
  const handleCurrencyChange = (currency: string) => {
    onChange({ ...value, currency });
  };
  const handleLanguageChange = (language: string) => {
    onChange({ ...value, language });
  };

  // Tall fields for payment details
  return (
    <form
      className="flex flex-col gap-6 py-4"
      onSubmit={e => {
        e.preventDefault();
      }}
      autoComplete="off"
    >
      {/* Currency & Language selection */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-1">
            Currency
          </label>
          <Select
            value={value.currency || "USD"}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(cur => (
                <SelectItem key={cur.code} value={cur.code}>
                  {cur.symbol} - {cur.name} ({cur.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-1">
            Language
          </label>
          <Select
            value={value.language || "en"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Top: logo upload */}
      <LogoUpload
        logoUrl={value.from.logoUrl}
        onLogoChange={logoUrl =>
          onChange({ ...value, from: { ...value.from, logoUrl } })
        }
      />
      {/* Invoice/Common Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1">Invoice Number</label>
          <Input
            value={value.invoiceNumber}
            onChange={e => onChange({ ...value, invoiceNumber: e.target.value })}
            placeholder="e.g. 1001"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1">PO Number</label>
          <Input
            value={value.poNumber}
            onChange={e => onChange({ ...value, poNumber: e.target.value })}
            placeholder="PO-Optional"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1">Issue Date</label>
          <Popover open={showIssuePicker} onOpenChange={setShowIssuePicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full font-normal justify-between"
              >
                <span>
                  <CalendarIcon className="inline h-4 w-4 mr-2 text-muted-foreground" />
                  {value.issueDate ? format(value.issueDate, "PPP") : "Pick date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.issueDate}
                onSelect={date => onChange({ ...value, issueDate: date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1">Due Date</label>
          <Popover open={showDuePicker} onOpenChange={setShowDuePicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full font-normal justify-between"
              >
                <span>
                  <CalendarIcon className="inline h-4 w-4 mr-2 text-muted-foreground" />
                  {value.dueDate ? format(value.dueDate, "PPP") : "Pick date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.dueDate}
                onSelect={date => onChange({ ...value, dueDate: date })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Your business info */}
      <div>
        <div className="font-semibold text-base mb-1 mt-4">Your Business Info</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Company</label>
            <Input
              value={value.from.company}
              onChange={e => onChange({ ...value, from: { ...value.from, company: e.target.value } })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              value={value.from.address}
              onChange={e => onChange({ ...value, from: { ...value.from, address: e.target.value } })}
              placeholder="Business address"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={value.from.phone}
              onChange={e => onChange({ ...value, from: { ...value.from, phone: e.target.value } })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={value.from.email}
              onChange={e => onChange({ ...value, from: { ...value.from, email: e.target.value } })}
            />
          </div>
        </div>
      </div>
      {/* Client info */}
      <div>
        <div className="font-semibold text-base mb-1 mt-4">Client Info</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={value.to.name}
              onChange={e => onChange({ ...value, to: { ...value.to, name: e.target.value } })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              value={value.to.address}
              onChange={e => onChange({ ...value, to: { ...value.to, address: e.target.value } })}
              placeholder="Client address"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={value.to.phone}
              onChange={e => onChange({ ...value, to: { ...value.to, phone: e.target.value } })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={value.to.email}
              onChange={e => onChange({ ...value, to: { ...value.to, email: e.target.value } })}
            />
          </div>
        </div>
      </div>
      {/* Line Items */}
      <div>
        <div className="font-semibold text-base mb-1 mt-4">Line Items</div>
        <div className="bg-muted/50 rounded-lg border">
          <div className="px-2 py-2">
            {value.lineItems.map((item: InvoiceLineItem, idx: number) => (
              <InvoiceLineItemRow
                key={idx}
                item={item}
                index={idx}
                onChange={updateLineItem}
                onRemove={removeLineItem}
                disableRemove={value.lineItems.length === 1}
              />
            ))}
            <Button
              type="button"
              size="sm"
              className="mt-1"
              variant="secondary"
              onClick={addLineItem}
            >
              + Add Item
            </Button>
          </div>
        </div>
      </div>
      {/* Tax/Discount */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Tax Rate %</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={value.taxRate}
            onChange={e => onChange({ ...value, taxRate: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">Discount (absolute)</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={value.discount}
            onChange={e => onChange({ ...value, discount: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      {/* Payment details */}
      <div>
        <div className="font-semibold text-base mb-1 mt-4">Payment Details</div>
        <label className="text-sm font-medium">Payment Methods</label>
        <Select
          value={value.paymentMethods}
          onValueChange={selected =>
            onChange({ ...value, paymentMethods: selected })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bank Transfers">Bank Transfers</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Credit and Debit Cards">Credit and Debit Cards</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
          </SelectContent>
        </Select>
        <label className="text-sm font-medium mt-2">Payment Due</label>
        <Input
          value={value.paymentDue}
          onChange={e => onChange({ ...value, paymentDue: e.target.value })}
          placeholder="Due upon receipt, Net 30..."
        />
        <label className="text-sm font-medium mt-2">Late Payment Penalty</label>
        <Input
          value={value.latePenalty}
          onChange={e => onChange({ ...value, latePenalty: e.target.value })}
          placeholder="e.g. 2% per month"
        />
        <label className="text-sm font-medium mt-2">Online Payment Link</label>
        <div className="flex items-center gap-1">
          <Input
            value={value.onlinePayment}
            onChange={e => onChange({ ...value, onlinePayment: e.target.value })}
            placeholder="Paste payment URL"
          />
          <Link className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      {/* Notes */}
      <div>
        <label className="text-sm font-medium mt-2">Additional Notes</label>
        <Input
          value={value.notes}
          onChange={e => onChange({ ...value, notes: e.target.value })}
          placeholder="Anything else..."
        />
      </div>
      {/* Footer fields */}
      <div className="grid grid-cols-1 gap-2 mt-2">
        <label className="text-sm font-medium">Thank You Message</label>
        <Input
          value={value.thankYouMessage}
          onChange={e => onChange({ ...value, thankYouMessage: e.target.value })}
          placeholder="Thank you for your business!"
        />
        <label className="text-sm font-medium">Company Slogan (optional)</label>
        <Input
          value={value.companySlogan}
          onChange={e => onChange({ ...value, companySlogan: e.target.value })}
          placeholder="Your company slogan"
        />
        <label className="text-sm font-medium">Copyright Notice</label>
        <Input
          value={value.copyright}
          onChange={e => onChange({ ...value, copyright: e.target.value })}
          placeholder="© 2024 Your Company, Inc."
        />
      </div>

      {/* Digital Signature */}
      <div className="mt-3">
        <div className="font-semibold text-base mb-1">Digital Signature</div>
        <SignatureField value={value.digitalSignature ?? null} onChange={handleSignatureChange} />
      </div>
      {/* Spacer for sticky preview */}
      <div className="pb-40" />
    </form>
  );
};

export default InvoiceForm;
