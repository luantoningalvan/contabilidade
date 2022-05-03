import * as React from "react";

import { FormControl, Select, FormLabel, Stack } from "@chakra-ui/react";
import { Modal } from "../../components/Modal";
import { months, years } from "./static";

interface PeriodModalProps {
  open: boolean;
  onClose(): void;
  onSubmit: (date: { year: number; month: number }) => void;
}

export function PeriodModal(props: PeriodModalProps) {
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
