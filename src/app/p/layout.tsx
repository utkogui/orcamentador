import type { ReactNode } from "react";

/** Layout sem chrome interno — link limpo para o comercial/cliente. */
export default function SharedProposalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="share-proposal-page min-h-screen bg-neutral-100 px-4 py-8 sm:px-6">
      {children}
    </div>
  );
}
