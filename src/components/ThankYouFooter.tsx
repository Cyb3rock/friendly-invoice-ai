
import React from "react";

type Props = {
  thankYouMessage: string;
  companySlogan?: string;
  copyright?: string;
};

const ThankYouFooter: React.FC<Props> = ({
  thankYouMessage,
  companySlogan,
  copyright
}) => (
  <footer className="pt-6 mt-6 border-t border-border text-center text-sm text-muted-foreground space-y-1 select-none">
    <div>{thankYouMessage}</div>
    {companySlogan && <div className="italic opacity-80">{companySlogan}</div>}
    {copyright && <div className="opacity-50">{copyright}</div>}
  </footer>
);

export default ThankYouFooter;
