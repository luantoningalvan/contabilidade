import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";
import { Category } from "../containers/Home/types";

type CategoryInput = Omit<Category, "id">;

interface CategoriesProviderProps {
  children: ReactNode;
}

interface CategoriesContextData {
  categories: Category[];
  createCategory(transation: CategoryInput): Promise<void>;
  fetchCategories(): Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextData>(
  {} as CategoriesContextData
);

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    const res = await api.get("/categories");
    setCategories(res.data);
  }

  async function createCategory(categoryInput: CategoryInput) {
    const response = await api.post("/categories", categoryInput);
    const category = response.data;

    setCategories([...categories, category]);
  }

  return (
    <CategoriesContext.Provider
      value={{ categories, fetchCategories, createCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  return context;
}