import React, { useEffect } from "react";
import {
  Button,
  Heading,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { isSameMonth, format, lastDayOfMonth } from "date-fns";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const months = {
  1: "Jan",
  2: "Fev",
  3: "Mar",
  4: "Abr",
  5: "Mai",
  6: "Jun",
  7: "Jul",
  8: "Ago",
  9: "Set",
  10: "Out",
  11: "Nov",
  12: "Dez",
};

export const MonthSelector = ({ value, onChange }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [year, setYear] = React.useState(new Date().getFullYear());
  const [month, setMonth] = React.useState<Date>();
  const [text, setText] = React.useState<string>();

  useEffect(() => {
    if (value) {
      setMonth(value);
      setText(format(value, "MM/yyyy"));
      setYear(new Date(value).getFullYear());
    }
  }, [value]);

  const handleNextYear = React.useCallback(() => {
    setYear((curr) => curr + 1);
  }, []);

  const handlePrevYear = React.useCallback(() => {
    setYear((curr) => curr - 1);
  }, []);

  const handleSelectMonth = React.useCallback(
    (month: number) => {
      const newMonth = lastDayOfMonth(new Date(year, month - 1));
      setMonth(newMonth);
      setText(format(newMonth, "MM/yyyy"));
      onChange(newMonth);
      onClose();
    },
    [year, onClose, onChange]
  );

  const handleCheckDateValidity = React.useCallback(
    (e) => {
      const isValid = /(0[1-9]|1[0-2])\/([12]\d{3})/.test(e.target.value);
      if (isValid) {
        const [monthValue, yearValue] = e.target.value.split("/");
        setYear(Number(yearValue));
        const newMonth = lastDayOfMonth(
          new Date(Number(yearValue), Number(monthValue) - 1)
        );
        setMonth(newMonth);
        onChange(newMonth);
      } else {
        setText("");
      }
    },
    [onChange]
  );

  const handleChange = React.useCallback((e) => {
    setText(e.target.value);
  }, []);

  return (
    <Popover
      placement="bottom-end"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Input
          value={text}
          onChange={handleChange}
          onBlurCapture={handleCheckDateValidity}
          placeholder="Vencimento"
          flex={1}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />

        <PopoverHeader fontWeight="semibold" display="flex" alignItems="center">
          <IconButton
            aria-label="Mês anterior"
            onClick={handlePrevYear}
            size="sm"
          >
            <FiArrowLeft />
          </IconButton>
          <Heading size="sm" textAlign="center" flex={1}>
            {year}
          </Heading>
          <IconButton
            aria-label="Próximo mês"
            onClick={handleNextYear}
            size="sm"
          >
            <FiArrowRight />
          </IconButton>
        </PopoverHeader>
        <PopoverBody>
          <SimpleGrid columns={3} spacing={2}>
            {Object.keys(months).map((key) => {
              const selected =
                month && isSameMonth(month, new Date(year, Number(key) - 1));
              return (
                <Button
                  size="sm"
                  key={key}
                  variant={selected ? "solid" : "outline"}
                  colorScheme={selected ? "blue" : "gray"}
                  onClick={() => handleSelectMonth(Number(key))}
                >
                  {months[key]}
                </Button>
              );
            })}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
