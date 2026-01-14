"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TemplateEditorContextType = {
  templateId: string;
  customData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  setAllData: (data: Record<string, any>) => void;
};

const TemplateEditorContext = createContext<
  TemplateEditorContextType | undefined
>(undefined);

type TemplateEditorProviderProps = {
  children: ReactNode;
  templateId: string;
  initialData?: Record<string, any>;
};

export function TemplateEditorProvider({
  children,
  templateId,
  initialData = {},
}: TemplateEditorProviderProps) {
  const [customData, setCustomData] = useState<Record<string, any>>(
    initialData
  );

  const updateField = (key: string, value: any) => {
    setCustomData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setAllData = (data: Record<string, any>) => {
    setCustomData(data);
  };

  return (
    <TemplateEditorContext.Provider
      value={{
        templateId,
        customData,
        updateField,
        setAllData,
      }}
    >
      {children}
    </TemplateEditorContext.Provider>
  );
}

export function useTemplateEditor() {
  const context = useContext(TemplateEditorContext);
  if (context === undefined) {
    throw new Error(
      "useTemplateEditor must be used within a TemplateEditorProvider"
    );
  }
  return context;
}
