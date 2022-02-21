import * as React from "react";

import {
  Box,
  Text,
  chakra,
  Heading,
  Stack,
  useToast,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiArrowDown,
  FiArrowUp,
  FiCheckSquare,
  FiEdit,
  FiTrash,
  FiFolder,
  FiBox,
} from "react-icons/fi";
import { api } from "../../services/api";
import { Category, Unit } from "./types";

import { Layout } from "../../components/Layout";
import { TopBar } from "./TopBar";
import { Table } from "../../components/Table";
import { NewUnit } from "../../shared/units/NewUnit";
import { useCategories } from "../../contexts/CategoriesContext";
import { FiDollarSign } from "react-icons/fi";
import { SellUnit } from "../../shared/units/SellUnit";
import { parseOptions } from "../../utils/parseOptions";
import { formatToBrl } from "../../utils/formatToBrl";
import { useConfirmation } from "../../hooks/useConfirmation";
import { EditUnit } from "../../shared/units/EditUnit";
import { NewCategory } from "../../shared/categories/NewCategory";
import { EmptyState } from "../../components/EmptyState";

export function Home() {
  const [newUnit, setNewUnit] = React.useState(false);
  const [units, setUnits] = React.useState<{
    data: Unit[];
    totalizers: { purchases: number; sales: number; profit: number };
  }>({ data: [], totalizers: { sales: 0, purchases: 0, profit: 0 } });

  const { fetchCategories, categories, setCurrentCategory, currentCategory } =
    useCategories();
  const [action, setAction] = React.useState<null | {
    type: "sell" | "edit" | "delete";
    unit: Unit;
  }>(null);
  const [filters, setFilters] = React.useState({});
  const [totalizers, setTotalizers] = React.useState(false);
  const confirmation = useConfirmation();
  const [newCategory, setNewCategory] = React.useState<boolean>(false);
  const toast = useToast();

  function handleChange(category) {
    setCurrentCategory(category);
  }

  async function fetchUnits() {
    const options = parseOptions({ cat: currentCategory.id, ...filters });
    const results = await api.get(`/units?${options}`);
    setUnits(results.data);
  }

  async function handleDelete(id: number) {
    confirmation({
      title: "Excluir unidade?",
      description: "Não será possível recuperá-la",
    }).then(async () => {
      await api.delete(`/units/${id}`);
      fetchUnits();
      toast({ status: "success", title: "Unidade excluída" });
    });
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

      {action !== null && action.type === "sell" && (
        <SellUnit
          onClose={() => setAction(null)}
          open={!!action}
          unit={action.unit}
          afterSubmit={fetchUnits}
        />
      )}

      {action !== null && action.type === "edit" && (
        <EditUnit
          onClose={() => setAction(null)}
          open={!!action}
          unitId={action.unit.id}
          afterSubmit={fetchUnits}
        />
      )}

      <Layout>
        {categories.length > 0 ? (
          <>
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

            <Box
              borderLeftWidth={1}
              p={3}
              h="full"
              w="240px"
              pos="fixed"
              right={0}
              transform={totalizers ? "translateX(0px)" : "translateX(240px)"}
              transition="transform 0.3s ease-in-out"
            >
              <Stack spacing={2}>
                <Box borderWidth={1} p={4} rounded={4}>
                  <Box display="flex" gap={2} color="gray.500">
                    <Text>Quantidade</Text>
                    <FiBox size={20} />
                  </Box>
                  <Heading size="lg" color="gray.700">
                    {units.data.length} un.
                  </Heading>
                </Box>
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

            <div
              style={{
                transition: "width 0.3s ease-in-out",
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

              <Box h="calc(100vh - 64px)" overflow="auto" mt={2}>
                {units.data.length > 0 ? (
                  <Table
                    onOrderChange={(v) =>
                      setFilters((curr) => ({
                        ...curr,
                        orderBy: v[0],
                        sort: v[1],
                      }))
                    }
                    columns={[
                      { label: "Nome", name: "name" },
                      {
                        label: "Preço Compra",
                        name: "purchase_price",
                        align: "right",
                        width: 180,
                        orderable: true,
                      },
                      {
                        label: "Vencimento",
                        name: "expiration_date",
                        orderable: true,
                      },
                      {
                        label: "Vendido",
                        name: "sold",
                        align: "center",
                        orderable: true,
                        width: 30,
                        format: (v, all) =>
                          v && (
                            <Tooltip label={`Vendido em ${all.sale_date}`}>
                              <div style={{ display: "inline-block" }}>
                                <FiCheckSquare size={18} color="#188d4f" />
                              </div>
                            </Tooltip>
                          ),
                      },
                      {
                        label: "Preço Venda",
                        name: "sale_price",
                        align: "right",
                        orderable: true,
                        width: 170,
                      },
                      {
                        label: "Lucro",
                        name: "profit",
                        align: "right",
                        width: 130,
                      },
                      { label: "Cliente", name: "client_name", align: "right" },
                    ]}
                    data={units.data}
                    contextActions={(unit: Unit) => [
                      {
                        label: "Vender",
                        icon: <FiDollarSign />,
                        hide: unit.sold,
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
                  />
                ) : (
                  <EmptyState
                    icon={FiBox}
                    title={
                      Object.values(filters).filter((v) => !!v).length > 0
                        ? "Nenhuma unidade que corresponda aos filtros"
                        : "Nenhuma unidade nesta categoria"
                    }
                    description="Cadastre uma unidade clicando no botão + "
                  />
                )}
              </Box>
            </div>
          </>
        ) : (
          <Box
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            boxSizing="border-box"
            textAlign="center"
            h="400"
            p={4}
          >
            <FiFolder size={56} />
            <Heading size="md" mt={4} mb={1}>
              Nenhuma categoria inserida
            </Heading>
            <Text fontSize="md" color="gray.600">
              Cadastre uma categoria para poder gerenciar seu estoque
            </Text>
            <Button
              colorScheme="purple"
              mt={4}
              onClick={() => setNewCategory(true)}
              leftIcon={<FiPlus />}
            >
              Cadastrar categoria
            </Button>
          </Box>
        )}
      </Layout>
    </>
  );
}
