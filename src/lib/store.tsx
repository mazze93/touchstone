"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_ENGAGEMENTS,
  SEED_FINDINGS,
  SEED_GOVERNANCE,
  SEED_PARTNERS,
} from "@/lib/seed";
import type {
  Engagement,
  Finding,
  GovernanceItem,
  Partner,
} from "@/lib/types";

const STORAGE_KEY = "touchstone-desk-v2";

type StoreState = {
  partners: Partner[];
  engagements: Engagement[];
  findings: Finding[];
  governance: GovernanceItem[];
};

type StoreContextValue = StoreState & {
  hydrated: boolean;
  addPartner: (partner: Omit<Partner, "id" | "lastTouch">) => void;
  updatePartner: (id: string, patch: Partial<Partner>) => void;
  addEngagement: (
    engagement: Omit<Engagement, "id" | "createdAt">,
  ) => void;
  updateEngagement: (id: string, patch: Partial<Engagement>) => void;
  addFinding: (
    finding: Omit<Finding, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateFinding: (id: string, patch: Partial<Finding>) => void;
  toggleGovernance: (id: string, completedBy: string) => void;
  resetDemoData: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const initialState: StoreState = {
  partners: SEED_PARTNERS,
  engagements: SEED_ENGAGEMENTS,
  findings: SEED_FINDINGS,
  governance: SEED_GOVERNANCE,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreState;
        setState({
          partners: parsed.partners ?? SEED_PARTNERS,
          engagements: parsed.engagements ?? SEED_ENGAGEMENTS,
          findings: parsed.findings ?? SEED_FINDINGS,
          governance: parsed.governance ?? SEED_GOVERNANCE,
        });
      }
    } catch {
      // Keep seed data if storage is unavailable or corrupt.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const addPartner = useCallback(
    (partner: Omit<Partner, "id" | "lastTouch">) => {
      setState((prev) => ({
        ...prev,
        partners: [
          {
            ...partner,
            id: uid("p"),
            lastTouch: today(),
          },
          ...prev.partners,
        ],
      }));
    },
    [],
  );

  const updatePartner = useCallback((id: string, patch: Partial<Partner>) => {
    setState((prev) => ({
      ...prev,
      partners: prev.partners.map((p) =>
        p.id === id ? { ...p, ...patch, lastTouch: today() } : p,
      ),
    }));
  }, []);

  const addEngagement = useCallback(
    (engagement: Omit<Engagement, "id" | "createdAt">) => {
      setState((prev) => ({
        ...prev,
        engagements: [
          {
            ...engagement,
            id: uid("e"),
            createdAt: today(),
          },
          ...prev.engagements,
        ],
      }));
    },
    [],
  );

  const updateEngagement = useCallback(
    (id: string, patch: Partial<Engagement>) => {
      setState((prev) => ({
        ...prev,
        engagements: prev.engagements.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      }));
    },
    [],
  );

  const addFinding = useCallback(
    (finding: Omit<Finding, "id" | "createdAt" | "updatedAt">) => {
      const stamp = today();
      setState((prev) => ({
        ...prev,
        findings: [
          {
            ...finding,
            id: uid("f"),
            createdAt: stamp,
            updatedAt: stamp,
            acknowledgedNoPayload: true,
          },
          ...prev.findings,
        ],
      }));
    },
    [],
  );

  const updateFinding = useCallback((id: string, patch: Partial<Finding>) => {
    setState((prev) => ({
      ...prev,
      findings: prev.findings.map((f) =>
        f.id === id ? { ...f, ...patch, updatedAt: today() } : f,
      ),
    }));
  }, []);

  const toggleGovernance = useCallback((id: string, completedBy: string) => {
    setState((prev) => ({
      ...prev,
      governance: prev.governance.map((g) => {
        if (g.id !== id) return g;
        if (g.completed) {
          return {
            ...g,
            completed: false,
            completedAt: undefined,
            completedBy: undefined,
          };
        }
        return {
          ...g,
          completed: true,
          completedAt: today(),
          completedBy,
        };
      }),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(initialState);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      addPartner,
      updatePartner,
      addEngagement,
      updateEngagement,
      addFinding,
      updateFinding,
      toggleGovernance,
      resetDemoData,
    }),
    [
      state,
      hydrated,
      addPartner,
      updatePartner,
      addEngagement,
      updateEngagement,
      addFinding,
      updateFinding,
      toggleGovernance,
      resetDemoData,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
