import * as React from "react";

import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FiSearch, FiCalendar, FiX } from "react-icons/fi";
import * as styled from "./styles";
import { Filters } from "./types";
import { Modal } from "../../components/Modal";

interface FilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
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

export function Filters(props: FilterProps) {
  const { filters, setFilters } = props;
  const [periodModal, setPeriodModal] = React.useState(false);

  return (
    <>
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

        <div>
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
                color="inherit"
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
