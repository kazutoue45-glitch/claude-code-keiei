"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { IssuerSettings } from "@/types/invoice";
import { DEFAULT_ISSUER_SETTINGS } from "@/types/invoice";

const STORAGE_KEY = "invoice-app-issuer-settings";

interface SettingsContextValue {
  settings: IssuerSettings;
  updateSettings: (settings: IssuerSettings) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_ISSUER_SETTINGS,
  updateSettings: () => {},
  isLoaded: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<IssuerSettings>(
    DEFAULT_ISSUER_SETTINGS
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...DEFAULT_ISSUER_SETTINGS, ...JSON.parse(stored) });
      } catch {
        // Invalid JSON, use defaults
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = useCallback((newSettings: IssuerSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  return (
    <SettingsContext value={{ settings, updateSettings, isLoaded }}>
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
