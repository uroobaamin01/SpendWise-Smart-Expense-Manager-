import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Finora` : 'Finora — Take control of your money';
  }, [title]);
}
