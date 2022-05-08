import { ChakraProps, chakra } from "@chakra-ui/react";
import { CreatableSelect as ChakraSelect } from "chakra-react-select";
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
  onCreate?: (text: string) => void;
}

export const Select = (props: SelectProps) => {
  const {
    control,
    placeholder,
    options,
    name,
    onCreate = () => {},
    ...rest
  } = props;

  return (
    <chakra.div {...rest}>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Preencha este campo" }}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <ChakraSelect
            options={options}
            placeholder={placeholder}
            onChange={(newValue) => onChange(newValue.value)}
            onBlur={onBlur}
            value={options.find((option) => value === option.value)}
            name={name}
            ref={ref}
            defaultValue={options.find((option) => value === option.value)}
            chakraStyles={{
              dropdownIndicator: (bs) => ({ ...bs, w: 8 }),
            }}
            onCreateOption={onCreate}
          />
        )}
      />
    </chakra.div>
  );
};
