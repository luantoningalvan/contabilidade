import * as React from "react";
import { IconButton, Tab, Tabs } from "@mui/material";
import { FiSettings } from "react-icons/fi";
import * as styled from "./styles";
import { Category } from "./types";

interface CategoriesProps {
  currentCategory: Category;
  handleChange(e: any, id: number): void;
  categories: Category[];
}

export function Categories(props: CategoriesProps) {
  const { categories, currentCategory, handleChange } = props;
  return (
    <styled.CategoriesBar color={currentCategory?.color}>
      <nav>
        <Tabs value={currentCategory?.id} onChange={handleChange}>
          {categories.map((cat) => (
            <Tab value={cat.id} label={cat.name} key={cat.id} />
          ))}
        </Tabs>
      </nav>
      <IconButton>
        <FiSettings />
      </IconButton>
    </styled.CategoriesBar>
  );
}
