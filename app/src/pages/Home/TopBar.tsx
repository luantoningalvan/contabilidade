import * as React from "react";

import {
  Button,
  Divider,
  FormControl,
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
  ButtonGroup,
  Box,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiCalendar,
  FiX,
  FiSettings,
  FiBarChart2,
} from "react-icons/fi";
import { VscGroupByRefType } from "react-icons/vsc";
import { HiViewGrid } from "react-icons/hi";
import { Category, Filters } from "./types";
import { useCategories } from "../../contexts/CategoriesContext";
import { ConfigureCategories } from "../../shared/categories/ConfigureCategories";
import { debounce } from "../../utils/debounce";
import { PeriodModal } from "./PeriodModal";

interface TopBarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  currentCategory: Category;
  handleChange(e: any): void;
  color: string;
  onToggleTotalizers: () => void;
}

export function TopBar(props: TopBarProps) {
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
          <Box display="flex" alignItems="center" gap={2}>
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

            <IconButton aria-label="">
              <VscGroupByRefType />
            </IconButton>
          </Box>

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
            {filters.status === 2 && (
              <div>
                <ButtonGroup isAttached>
                  {filters.period && (
                    <IconButton
                      aria-label="Add to friends"
                      icon={<FiX />}
                      onClick={() =>
                        setFilters({ ...filters, period: undefined })
                      }
                    />
                  )}
                  <Button
                    rightIcon={<FiCalendar />}
                    onClick={() => setPeriodModal(true)}
                  >
                    {filters.period
                      ? new Intl.DateTimeFormat("pt-BR", {
                          month: "long",
                          year: "numeric",
                        }).format(new Date(filters.period))
                      : "Todo tempo"}
                  </Button>
                </ButtonGroup>
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
                <option value={0}>Todos</option>
                <option value={2}>Vendidos</option>
                <option value={1}>Não vendidos</option>
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
