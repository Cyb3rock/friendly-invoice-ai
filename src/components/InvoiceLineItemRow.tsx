
import React from "react";
import { Input } from "@/components/ui/input";

type LineItem = {
  description: string;
  quantity: number;
  rate: number;
};

type Props = {
  item: LineItem;
  index: number;
  onChange: (i: number, item: LineItem) => void;
  onRemove: (i: number) => void;
  disableRemove: boolean;
};

const InvoiceLineItemRow: React.FC<Props> = ({
  item,
  index,
  onChange,
  onRemove,
  disableRemove,
}) => {
  function handleChange<K extends keyof LineItem>(key: K, value: string) {
    let newValue: string | number = value;
    if (key === "quantity" || key === "rate") {
      newValue = parseFloat(value) || 0;
    }
    onChange(index, { ...item, [key]: newValue });
  }

  const subtotal = +(item.quantity * item.rate).toFixed(2);

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2">
      <div className="col-span-5">
        <Input
          className="w-full"
          placeholder="Description"
          value={item.description}
          onChange={e => handleChange("description", e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min={0}
          className="w-full"
          value={item.quantity || ""}
          placeholder="Qty"
          onChange={e => handleChange("quantity", e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min={0}
          step="0.01"
          className="w-full"
          value={item.rate || ""}
          placeholder="Rate"
          onChange={e => handleChange("rate", e.target.value)}
        />
      </div>
      <div className="col-span-2 text-right text-muted-foreground tabular-nums font-mono text-base px-2">
        {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
      <div className="col-span-1 flex justify-end">
        <button
          type="button"
          className="p-1 px-2 rounded hover:bg-destructive/20 transition"
          onClick={() => onRemove(index)}
          disabled={disableRemove}
          aria-label="Remove Item"
        >
          <span className="text-destructive text-lg" aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceLineItemRow;
