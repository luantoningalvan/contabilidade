import React from "react";
import { CategoriesProvider } from "./CategoriesContext";
import { ConfirmationProvider } from "./ConfirmationContext";

export const AppContext = (props: { children: React.ReactNode }) => (
  <ConfirmationProvider>
    <CategoriesProvider>{props.children}</CategoriesProvider>
  </ConfirmationProvider>
);
