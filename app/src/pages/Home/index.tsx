import * as React from "react";

import { Box } from "@chakra-ui/react";
import { FiFolder } from "react-icons/fi";
import { api } from "../../services/api";
import { Unit } from "./types";
import { Layout } from "../../components/Layout";
import { EmptyState } from "../../components/EmptyState";
import { useCategories } from "../../contexts/CategoriesContext";
import { parseOptions } from "../../utils/parseOptions";
import { NewUnit } from "../../shared/units/NewUnit";
import { NewCategory } from "../../shared/categories/NewCategory";

import { TopBar } from "./TopBar";
import { Totalizers } from "./Totalizers";
import { UnitsTable } from "./UnitsTable";
import { FloatButton } from "./FloatButton";
import { HiOutlineClipboardList } from "react-icons/hi";

export function Home() {
  const [newUnit, setNewUnit] = React.useState(false);
  const [units, setUnits] = React.useState<{
    data: Unit[];
    totalizers: { purchases: number; sales: number; profit: number };
  }>({ data: [], totalizers: { sales: 0, purchases: 0, profit: 0 } });

  const { fetchCategories, categories, setCurrentCategory, currentCategory } =
    useCategories();

  const [filters, setFilters] = React.useState({});
  const [totalizers, setTotalizers] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState<boolean>(false);

  const fetchUnits = React.useCallback(async () => {
    const options = parseOptions({ cat: currentCategory.id, ...filters });
    const results = await api.get(`/units?${options}`);
    setUnits(results.data);
  }, [currentCategory, filters]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    if (currentCategory) {
      fetchUnits();
    }
  }, [currentCategory, filters, fetchUnits]);

  React.useEffect(() => {
    if (!currentCategory) {
      setCurrentCategory(categories[0]);
    }
  }, [categories, currentCategory, setCurrentCategory]);

  return (
    <>
      {newCategory && (
        <NewCategory open={newCategory} onClose={() => setNewCategory(false)} />
      )}

      {newUnit && (
        <NewUnit
          category={currentCategory?.id}
          open={newUnit}
          onClose={() => setNewUnit(false)}
          afterSubmit={fetchUnits}
        />
      )}

      <Layout>
        {categories.length > 0 ? (
          <>
            <FloatButton
              bg={currentCategory?.color}
              onClick={() => setNewUnit(true)}
            />

            <Totalizers
              isOpen={totalizers}
              counts={{
                ...units.totalizers,
                units: units.data.length,
              }}
            />

            <Box
              transition='width 0.3s ease-in-out"'
              width={totalizers ? "calc(100% - 240px)" : "100%"}
            >
              <TopBar
                filters={filters}
                setFilters={setFilters}
                handleChange={setCurrentCategory}
                currentCategory={currentCategory}
                color={currentCategory?.color}
                onToggleTotalizers={() => setTotalizers(!totalizers)}
              />

              {units.data.length > 0 ? (
                <UnitsTable
                  fetchUnits={fetchUnits}
                  setFilters={setFilters}
                  units={units}
                />
              ) : (
                <EmptyState
                  title="Nenhuma unidade inserida"
                  description="Para inserir uma nova unidade clique no botão localizado no canto inferior direito."
                  icon={HiOutlineClipboardList}
                />
              )}
            </Box>
          </>
        ) : (
          <EmptyState
            title="Nenhuma categoria inserida"
            description="Cadastre uma categoria para poder gerenciar seu estoque"
            icon={FiFolder}
            action={{
              text: "Cadastrar categoria",
              onClick: () => setNewCategory(true),
            }}
          />
        )}
      </Layout>
    </>
  );
}
