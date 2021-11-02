import * as React from "react";

import { Header } from "../../components/Header";
import { Table } from "../../components/Table";
import {
  Fab,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { FiPlus, FiCheckCircle, FiSettings, FiSearch } from "react-icons/fi";
import { NewUnit } from "../../shared/NewUnit";
import { api } from "../../services/api";
import * as styled from "./styles";

type Unit = {
  id: number;
  name: string;
  purchase_price: number;
  sale_price: number;
  profit: number;
  client_name: string;
  sold: boolean;
};

type Category = {
  id: number;
  name: string;
  color: string;
};

export function Home() {
  const [newUnit, setNewUnit] = React.useState(false);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(
    null
  );

  function handleChange(_, id: number) {
    setCurrentCategory(categories.find((cat) => cat.id === id) as Category);
  }

  async function fetchUnits() {
    const results = await api.get("/units");
    setUnits(results.data);
  }

  React.useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
      setCurrentCategory(res.data[0]);
    });
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

      <div style={{ height: "100vh" }}>
        <Header color={currentCategory?.color} />
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
        <styled.FilterBar>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            }}
            size="small"
            variant="outlined"
            placeholder="Buscar produto"
          />
        </styled.FilterBar>

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
