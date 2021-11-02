import * as React from "react";

import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FiSearch, FiCalendar } from "react-icons/fi";
import * as styled from "./styles";

export function Filters() {
  return (
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
        <Button endIcon={<FiCalendar />}>Todo tempo</Button>
        <FormControl size="small" style={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-label">Situação</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Situação"
          >
            <MenuItem>Todas</MenuItem>
            <MenuItem>Vendido</MenuItem>
            <MenuItem>Não vendido</MenuItem>
          </Select>
        </FormControl>
      </div>
    </styled.FilterBar>
  );
}
