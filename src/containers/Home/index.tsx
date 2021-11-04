import * as React from "react";

import { Drawer, Fab } from "@mui/material";
import { FiPlus, FiCheckCircle, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { api } from "../../services/api";
import { Category, Unit } from "./types";

import { Layout } from "../../components/Layout";
import { TopBar } from "./TopBar";
import { Table } from "../../components/Table";
import { NewUnit } from "../../shared/NewUnit";
import { useCategories } from "../../contexts/CategoriesContext";
import { FiDollarSign, FiEdit, FiTrash } from "react-icons/fi";
import { SellUnit } from "../../shared/SellUnit";
import { parseOptions } from "../../utils/parseOptions";
import { Totalizers } from "./styles";

export function Home() {
  const [newUnit, setNewUnit] = React.useState(false);
  const [units, setUnits] = React.useState<{
    data: Unit[];
    totalizers: { purchases: number; sales: number; profit: number };
  }>({ data: [], totalizers: { sales: 0, purchases: 0, profit: 0 } });
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(
    null
  );
  const { fetchCategories, categories } = useCategories();
  const [action, setAction] = React.useState<null | {
    type: "sell" | "edit" | "delete";
    unit: Unit;
  }>(null);
  const [filters, setFilters] = React.useState({});
  const [totalizers, setTotalizers] = React.useState(false);

  function handleChange(category) {
    setCurrentCategory(category);
  }

  async function fetchUnits() {
    const options = parseOptions({ cat: currentCategory.id, ...filters });
    const results = await api.get(`/units?${options}`);
    setUnits(results.data);
  }

  async function handleDelete(id: number) {
    const confirmExclusion = confirm("Relmente deseja excluir?");

    if (confirmExclusion) {
      await api.delete(`/units/${id}`);
      fetchUnits();
    }
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

      <Layout>
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

        <Drawer
          style={{ width: 200 }}
          anchor="right"
          variant="persistent"
          open={totalizers}
        >
          <Totalizers>
            <div>
              <header>
                <p>Compras</p>
                <FiArrowDown size={20} />
              </header>
              <strong>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(units.totalizers.purchases)}
              </strong>
            </div>
            <div>
              <header>
                <p>Vendas</p>
                <FiArrowUp size={20} />
              </header>
              <strong>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(units.totalizers.sales)}
              </strong>
            </div>
            <div className="highlight-color">
              <header>
                <p>Lucro</p>
                <FiDollarSign size={20} />
              </header>
              <strong>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(units.totalizers.profit)}
              </strong>
            </div>
          </Totalizers>
        </Drawer>

        <div
          style={{
            transition: "width 0.2s",
            width: totalizers ? "calc(100% - 200px)" : "100%",
          }}
        >
          <TopBar
            filters={filters}
            setFilters={setFilters}
            handleChange={handleChange}
            currentCategory={currentCategory}
            color={currentCategory?.color}
            onToggleTotalizers={() => setTotalizers(!totalizers)}
          />

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
                  onClick: () => handleDelete(unit.id),
                },
              ]}
              data={units.data}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
