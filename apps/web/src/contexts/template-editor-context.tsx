"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TemplateEditorContextType = {
  templateId: string;
  customData: Record<string, any>;
  price: number;
  updateField: (key: string, value: any) => void;
  setAllData: (data: Record<string, any>) => void;
  setPrice: (price: number) => void;
};

const TemplateEditorContext = createContext<
  TemplateEditorContextType | undefined
>(undefined);

type TemplateEditorProviderProps = {
  children: ReactNode;
  templateId: string;
  initialData?: Record<string, any>;
  initialPrice?: number;
};

export function TemplateEditorProvider({
  children,
  templateId,
  initialData = {},
  initialPrice = 0,
}: TemplateEditorProviderProps) {
  const [customData, setCustomData] = useState<Record<string, any>>(
    initialData
  );
  const [price, setPriceState] = useState<number>(initialPrice);

  const updateField = (key: string, value: any) => {
    setCustomData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setAllData = (data: Record<string, any>) => {
    setCustomData(data);
  };

  const setPrice = (newPrice: number) => {
    setPriceState(newPrice);
  };

  return (
    <TemplateEditorContext.Provider
      value={{
        templateId,
        customData,
        price,
        updateField,
        setAllData,
        setPrice,
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
