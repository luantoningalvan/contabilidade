import * as React from "react";

import {
  Button,
  Divider,
  FormControl,
  Grid,
  Menu,
  MenuItem,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  MenuButton,
  MenuList,
  IconButton,
  ThemeProvider,
  extendTheme,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiCalendar,
  FiX,
  FiSettings,
  FiEye,
  FiBarChart2,
} from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { Category, Filters } from "./types";
import { Modal } from "../../components/Modal";
import { useCategories } from "../../contexts/CategoriesContext";
import { ConfigureCategories } from "../../shared/categories/ConfigureCategories";
import { debounce } from "../../utils/debounce";

interface FilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  currentCategory: Category;
  handleChange(e: any): void;
  color: string;
  onToggleTotalizers: () => void;
}

const years = [2018, 2019, 2020, 2021, 2022];
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function PeriodModal(props: {
  open: boolean;
  onClose(): void;
  onSubmit: (date: { year: number; month: number }) => void;
}) {
  const [period, setPeriod] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title="Escolha o mês"
      footer={{
        primary: {
          text: "Escolher período",
          onClick: () => {
            props.onSubmit(period);
            props.onClose();
          },
        },
      }}
    >
      <Stack>
        <FormControl>
          <FormLabel htmlFor="name-field">Mês</FormLabel>

            <Select
              value={period.month}
              onChange={(e) =>
                setPeriod({ ...period, month: Number(e.target.value) })
              }
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </Select>
          </FormControl>
        <FormControl>
          <FormLabel htmlFor="name-field">Ano</FormLabel>

            <Select
              value={period.year}
              onChange={(e) =>
                setPeriod({ ...period, year: Number(e.target.value) })
              }
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </FormControl>
      </Stack>
    </Modal>
  );
}

export function TopBar(props: FilterProps) {
  const { filters, setFilters } = props;
  const [periodModal, setPeriodModal] = React.useState(false);
  const [configure, setConfigure] = React.useState(false);
  const { categories } = useCategories();
  const { currentCategory, handleChange } = props;
  const darkTheme = extendTheme({
    initialColorMode: "dark",
    useSystemColorMode: false,
  });

  const handleSearch = debounce((txt: string) => {
    setFilters({ ...filters, search: txt });
  });

  return (
    <>
      <ConfigureCategories
        open={configure}
        onClose={() => setConfigure(false)}
      />

      <PeriodModal
        open={periodModal}
        onClose={() => setPeriodModal(false)}
        onSubmit={(date) =>
          setFilters({
            ...filters,
            period: new Date(date.year, date.month).toDateString(),
          })
        }
      />

      <ThemeProvider theme={darkTheme}>
        <Flex
          justifyContent="space-between"
          py={2}
          px={4}
          h="56px"
          borderBottomWidth={1}
        >
          <Menu>
            <MenuButton
              bg={currentCategory?.color}
              _hover={{ filter: "brightness(1.1)" }}
              _active={{ filter: "brightness(1.2)" }}
              color="white"
              as={Button}
              variant="outline"
              leftIcon={<HiViewGrid />}
            >
              {currentCategory?.name}
            </MenuButton>
            <MenuList>
              {categories.map((cat) => (
                <MenuItem
                  value={cat.id}
                  key={cat.id}
                  onClick={() => handleChange(cat)}
                >
                  {cat.name}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem
                icon={<FiSettings size={18} />}
                onClick={() => setConfigure(true)}
              >
                Configurar categorias
              </MenuItem>
            </MenuList>
          </Menu>

          <Flex gap={2}>
            <InputGroup>
              <InputLeftElement>
                <FiSearch />
              </InputLeftElement>
              <Input
                placeholder="Buscar produto"
                onChange={(e) => handleSearch(e.target.value)}
                width="auto"
              />
            </InputGroup>
            {filters.status === 1 && (
              <div>
                {filters.period && (
                  <Button
                    size="small"
                    onClick={() =>
                      setFilters({ ...filters, period: undefined })
                    }
                  >
                    <FiX />
                  </Button>
                )}
                <Button
                  endIcon={<FiCalendar />}
                  onClick={() => setPeriodModal(true)}
                >
                  {filters.period
                    ? new Intl.DateTimeFormat("pt-BR", {
                        month: "long",
                        year: "numeric",
                      }).format(new Date(filters.period))
                    : "Todo tempo"}
                </Button>
              </div>
            )}
            <FormControl size="small" style={{ minWidth: 200 }}>
              <Select
                label="Situação"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: Number(e.target.value) })
                }
              >
                <option value={null}>Todos</option>
                <option value={1}>Vendidos</option>
                <option value={0}>Não vendidos</option>
              </Select>
            </FormControl>
            <IconButton
              aria-label="Visualizar totalizadores"
              onClick={props.onToggleTotalizers}
            >
              <FiBarChart2 />
            </IconButton>
          </Flex>
        </Flex>
      </ThemeProvider>
    </>
  );
}
