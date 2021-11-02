import * as React from "react";
import { IconButton, Tab, Tabs } from "@mui/material";
import { FiSettings } from "react-icons/fi";
import * as styled from "./styles";
import { Category } from "./types";
import { ConfigureCategories } from "../../shared/ConfigureCategories";
import { useCategories } from "../../contexts/CategoriesContext";

interface CategoriesProps {
  currentCategory: Category;
  handleChange(e: any, id: number): void;
}

export function Categories(props: CategoriesProps) {
  const [configure, setConfigure] = React.useState(false);
  const { categories } = useCategories();
  const { currentCategory, handleChange } = props;

  return (
    <>
      <ConfigureCategories
        open={configure}
        onClose={() => setConfigure(false)}
      />

      <styled.CategoriesBar color={currentCategory?.color}>
        <nav>
          <Tabs value={currentCategory?.id} onChange={handleChange}>
            {categories.map((cat) => (
              <Tab value={cat.id} label={cat.name} key={cat.id} />
            ))}
          </Tabs>
        </nav>
        <IconButton onClick={() => setConfigure(true)}>
          <FiSettings />
        </IconButton>
      </styled.CategoriesBar>
    </>
  );
}
