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
import { FiDollarSign, FiEdit, FiTrash } from "react-icons/fi";
import { SellUnit } from "../../shared/SellUnit";
import { parseOptions } from "../../utils/parseOptions";

export function Home() {
  const [newUnit, setNewUnit] = React.useState(false);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(
    null
  );
  const { fetchCategories, categories } = useCategories();
  const [action, setAction] = React.useState<null | {
    type: "sell" | "edit" | "delete";
    unit: Unit;
  }>(null);
  const [filters, setFilters] = React.useState({});

  function handleChange(_, id: number) {
    setCurrentCategory(categories.find((cat) => cat.id === id) as Category);
  }

  async function fetchUnits() {
    const options = parseOptions({ cat: currentCategory.id, ...filters });
    const results = await api.get(`/units?${options}`);
    setUnits(results.data);
  }

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    if (currentCategory) {
      fetchUnits();
    }
  }, [currentCategory, filters]);

  React.useEffect(() => {
    if (!currentCategory) {
      setCurrentCategory(categories[0]);
    }
  }, [categories, currentCategory]);

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

      {action !== null && action.type === "sell" && (
        <SellUnit
          onClose={() => setAction(null)}
          open={!!action}
          unit={action.unit}
          afterSubmit={fetchUnits}
        />
      )}

      <Fab
        aria-label="Incluir unidade"
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

      <Filters filters={filters} setFilters={setFilters} />

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
          contextActions={(unit: Unit) => [
            {
              label: "Vender",
              icon: <FiDollarSign />,
              onClick: () => setAction({ type: "sell", unit }),
            },
            {
              label: "Editar",
              icon: <FiEdit />,
              onClick: () => setAction({ type: "edit", unit }),
            },
            {
              label: "Excluir",
              icon: <FiTrash />,
              onClick: () => setAction({ type: "delete", unit }),
            },
          ]}
          data={units}
        />
      </div>
    </>
  );
}
