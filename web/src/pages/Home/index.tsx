import * as React from "react";

import {
  Box,
  Text,
  chakra,
  Checkbox,
  Heading,
  Stack,
  Fade,
  Slide,
} from "@chakra-ui/react";
import { FiPlus, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { api } from "../../services/api";
import { Category, Unit } from "./types";

import { Layout } from "../../components/Layout";
import { TopBar } from "./TopBar";
import { Table } from "../../components/Table";
import { NewUnit } from "../../shared/NewUnit";
import { useCategories } from "../../contexts/CategoriesContext";
import { FiDollarSign } from "react-icons/fi";
import { SellUnit } from "../../shared/SellUnit";
import { parseOptions } from "../../utils/parseOptions";
import { formatToBrl } from "../../utils/formatToBrl";

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
    const confirmExclusion = window.confirm("Relmente deseja excluir?");

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
        <chakra.button
          size="lg"
          aria-label="Incluir unidade"
          pos="fixed"
          bg={currentCategory?.color}
          right="24px"
          bottom="24px"
          h="56px"
          w="56px"
          display="flex"
          shadow="md"
          justifyContent="center"
          alignItems="center"
          rounded="50%"
          onClick={() => setNewUnit(true)}
        >
          <FiPlus size={32} color="white" />
        </chakra.button>

        <Slide in={totalizers}>
          <Box
            borderLeftWidth={1}
            p={3}
            h="full"
            w="240px"
            pos="fixed"
            right={0}
          >
            <Stack spacing={2}>
              <Box borderWidth={1} p={4} rounded={4}>
                <Box display="flex" gap={2} color="gray.500">
                  <Text>Compras</Text>
                  <FiArrowDown size={20} />
                </Box>
                <Heading size="lg" color="gray.700">
                  {formatToBrl(units.totalizers.purchases)}
                </Heading>
              </Box>
              <Box borderWidth={1} p={4} rounded={4}>
                <Box display="flex" color="gray.500" gap={2}>
                  <Text>Vendas</Text>
                  <FiArrowUp size={20} />
                </Box>
                <Heading size="lg" color="gray.700">
                  {formatToBrl(units.totalizers.sales)}
                </Heading>
              </Box>
              <Box borderWidth={1} p={4} rounded={4}>
                <Box display="flex" gap={2} color="gray.500">
                  <Text>Lucro</Text>
                  <FiDollarSign size={20} />
                </Box>
                <Heading size="lg" color="gray.700">
                  {formatToBrl(units.totalizers.profit)}
                </Heading>
              </Box>
            </Stack>
          </Box>
        </Slide>

        <div
          style={{
            transition: "width 0.5s",
            width: totalizers ? "calc(100% - 240px)" : "100%",
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

          <Box h="calc(100vh - 154px)" overflow="auto" mt={2}>
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
                  format: (v, row) => (
                    <Checkbox
                      defaultChecked={v}
                      onChange={() => setAction({ type: "sell", unit: row })}
                    />
                  ),
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
              data={units.data}
            />
          </Box>
        </div>
      </Layout>
    </>
  );
}
