import { useCallback, useEffect, useState } from 'react';
import { summaryService } from '../services/summaryService';

/** Fetches income/expense totals for the months ending at `endMonth` from the summary API. */
export function useMonthlySeries(endMonth, months = 6) {
  const [state, setState] = useState({ series: [], loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));
    summaryService
      .getMonthlySeries({ months, end: endMonth })
      .then((series) => !cancelled && setState({ series, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ series: [], loading: false, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [endMonth, months, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  return { ...state, reload };
}
