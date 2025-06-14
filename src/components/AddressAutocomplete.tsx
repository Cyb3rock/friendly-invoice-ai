
import React from "react";
import { Input } from "@/components/ui/input";

// To avoid issues in SSR/server-side environments, check for window
const loadGooglePlaces = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      resolve();
    } else {
      const interval = setInterval(() => {
        if (
          (window as any).google &&
          (window as any).google.maps &&
          (window as any).google.maps.places
        ) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    }
  });
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const AddressAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Enter address"
}) => {
  const [suggestions, setSuggestions] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const serviceRef = React.useRef<google.maps.places.AutocompleteService | null>(null);

  React.useEffect(() => {
    let didCancel = false;
    loadGooglePlaces().then(() => {
      if (!didCancel && !(serviceRef.current)) {
        serviceRef.current = new (window as any).google.maps.places.AutocompleteService();
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);

  // Fetch predictions as user types
  React.useEffect(() => {
    if (!value) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    if (!serviceRef.current) return;
    setLoading(true);
    serviceRef.current.getPlacePredictions(
      {
        input: value,
        types: ["address"],
        componentRestrictions: { country: [] }, // set to [] to allow any country, or ['us'] for only US
      },
      (predictions: google.maps.places.AutocompletePrediction[] | null) => {
        setLoading(false);
        if (predictions && predictions.length > 0) {
          setSuggestions(predictions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }
    );
  }, [value]);

  // Hide dropdown if user clicks outside
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!inputRef.current) return;
      if (!inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showDropdown]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-20 bg-white shadow-lg border mt-1 rounded-md max-h-60 overflow-auto">
          {suggestions.map(item => (
            <button
              className="block w-full text-left px-3 py-2 hover:bg-muted cursor-pointer text-sm"
              key={item.place_id}
              type="button"
              onClick={() => {
                onChange(item.description);
                setShowDropdown(false);
              }}
            >
              {item.description}
            </button>
          ))}
        </div>
      )}
      {loading && (
        <div className="absolute left-0 right-0 top-full text-xs px-3 py-1 text-muted-foreground bg-white border rounded-b">Loading...</div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
