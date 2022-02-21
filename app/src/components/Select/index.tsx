import { ChakraProps, chakra } from "@chakra-ui/react";
import { Select as ChakraSelect } from "chakra-react-select";
import { Controller, Control } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

interface SelectProps extends ChakraProps {
  name: string;
  options: Option[];
  control: Control<any>;
  placeholder?: string;
}

export const Select = (props: SelectProps) => {
  const { control, placeholder, options, name, ...rest } = props;

  return (
    <chakra.div {...rest}>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <ChakraSelect
              options={options}
              placeholder={placeholder}
              onChange={(newValue) => onChange(newValue.value)}
              onBlur={onBlur}
              value={options.find((option) => value === option.value)}
              defaultValue={options.find((option) => value === option.value)}
              chakraStyles={{
                dropdownIndicator: (bs) => ({ ...bs, w: 8 }),
              }}
            />
          );
        }}
      />
    </chakra.div>
  );
};
