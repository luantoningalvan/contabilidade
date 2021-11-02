import * as React from "react";

import { Fab } from "@mui/material";
import { FiPlus, FiCheckCircle } from "react-icons/fi";
import { api } from "../../services/api";
import { Category, Unit } from "./types";

import { Header } from "../../components/Header";
import { Categories } from "./Categories";
import { Filters } from "./Filters";
import { Table } from "../../components/Table";
import { NewUnit } from "../../shared/NewUnit";
import { useCategories } from "../../contexts/CategoriesContext";

export function Home() {
  const [newUnit, setNewUnit] = React.useState(false);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(
    null
  );
  const { fetchCategories, categories } = useCategories();

  function handleChange(_, id: number) {
    setCurrentCategory(categories.find((cat) => cat.id === id) as Category);
  }

  async function fetchUnits() {
    const results = await api.get("/units");
    setUnits(results.data);
  }

  React.useEffect(() => {
    fetchCategories();
    fetchUnits();
  }, []);

  return (
    <>
      {newUnit && (
        <NewUnit
          category={currentCategory?.id}
          open={newUnit}
          onClose={() => setNewUnit(false)}
          afterSubmit={fetchUnits}
        />
      )}

      <Fab
        aria-label="add"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: currentCategory?.color,
          color: "#fff",
        }}
        onClick={() => setNewUnit(true)}
      >
        <FiPlus size={32} />
      </Fab>

      <Header color={currentCategory?.color} />

      <Categories
        handleChange={handleChange}
        currentCategory={currentCategory}
      />

      <Filters />

      <div style={{ height: "calc(100vh - 154px)", overflow: "auto" }}>
        <Table
          columns={[
            { label: "Nome", name: "name" },
            {
              label: "Preço Compra",
              name: "purchase_price",
              align: "right",
              width: 160,
            },
            {
              label: "Vendido",
              name: "sold",
              align: "center",
              format: (v) => v && <FiCheckCircle color="#03aa03" />,
            },
            {
              label: "Preço Venda",
              name: "sale_price",
              align: "right",
              width: 150,
            },
            { label: "Lucro", name: "profit", align: "right", width: 130 },
            { label: "Cliente", name: "client_name", align: "right" },
          ]}
          data={units}
        />
      </div>
    </>
  );
}
