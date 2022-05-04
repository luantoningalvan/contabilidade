import React from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";
import { Category } from "../pages/Home/types";

type CategoryInput = Omit<Category, "id">;

interface CategoriesProviderProps {
  children: ReactNode;
}

interface CategoriesContextData {
  categories: Category[];
  createCategory(transation: CategoryInput): Promise<void>;
  updateCategory(id: number, transation: CategoryInput): Promise<void>;
  fetchCategories(): Promise<void>;
  currentCategory: any;
  setCurrentCategory: any;
}

const CategoriesContext = createContext<CategoriesContextData>(
  {} as CategoriesContextData
);

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const fetchCategories = React.useCallback(async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  }, []);

  const createCategory = React.useCallback(
    async (categoryInput: CategoryInput) => {
      const response = await api.post("/categories", categoryInput);
      const category = response.data;

      setCategories((curr) => [...curr, category]);
    },
    []
  );

  const updateCategory = React.useCallback(
    async (id: number, categoryInput: CategoryInput) => {
      const response = await api.put(`/categories/${id}`, categoryInput);
      const newCategoryData = response.data;

      setCategories((curr) =>
        curr.map((cat) => (cat.id === id ? newCategoryData : cat))
      );
    },
    []
  );

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        fetchCategories,
        createCategory,
        currentCategory,
        setCurrentCategory,
        updateCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  return context;
}
