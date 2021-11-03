import * as React from "react";

import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  FiSearch,
  FiCalendar,
  FiX,
  FiChevronDown,
  FiSettings,
} from "react-icons/fi";
import * as styled from "./styles";
import { Category, Filters } from "./types";
import { Modal } from "../../components/Modal";
import { useCategories } from "../../contexts/CategoriesContext";
import { ConfigureCategories } from "../../shared/ConfigureCategories";

interface FilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  currentCategory: Category;
  handleChange(e: any): void;
  color: string;
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
      fullWidth
      maxWidth="xs"
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Mês</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Mês"
              value={period.month}
              onChange={(e) =>
                setPeriod({ ...period, month: Number(e.target.value) })
              }
            >
              {months.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Ano</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Ano"
              value={period.year}
              onChange={(e) =>
                setPeriod({ ...period, year: Number(e.target.value) })
              }
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Modal>
  );
}

export function TopBar(props: FilterProps) {
  const { filters, setFilters } = props;
  const [periodModal, setPeriodModal] = React.useState(false);
  const [configure, setConfigure] = React.useState(false);
  const { categories } = useCategories();
  const { currentCategory, handleChange } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      <styled.FilterBar color={props.color}>
        <Button
          variant="outlined"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          endIcon={<FiChevronDown />}
        >
          {currentCategory?.name}
        </Button>

        <Menu
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <MenuItem
              value={cat.id}
              key={cat.id}
              onClick={() => {
                handleChange(cat);
                setAnchorEl(null);
              }}
            >
              {cat.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            onClick={() => {
              setConfigure(true);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <FiSettings size={18} />
            </ListItemIcon>
            <ListItemText>Configurar categorias</ListItemText>
          </MenuItem>
        </Menu>

        <div>
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
          {filters.status === 1 && (
            <div>
              {filters.period && (
                <IconButton
                  size="small"
                  onClick={() => setFilters({ ...filters, period: undefined })}
                >
                  <FiX />
                </IconButton>
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
            <InputLabel id="demo-simple-select-label">Situação</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Situação"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value as number })
              }
            >
              <MenuItem value={null}>Todos</MenuItem>
              <MenuItem value={1}>Vendidos</MenuItem>
              <MenuItem value={0}>Não vendidos</MenuItem>
            </Select>
          </FormControl>
        </div>
      </styled.FilterBar>
    </>
  );
}
