import { FormControl, FormLabel, Input, Stack, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Modal } from "../../../components/Modal";
import { useCategories } from "../../../contexts/CategoriesContext";

interface NewCategoryProps {
  open: boolean;
  onClose: () => void;
}

export function NewCategory(props: NewCategoryProps) {
  const [data, setData] = React.useState<any>({ color: "#000", name: "" });
  const { createCategory } = useCategories();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      await createCategory(data);
      props.onClose();
    } catch (error) {
      alert("Erro ao criar categoria");
    }
  };

  return (
    <Modal
      title="Nova categoria"
      open={props.open}
      onClose={props.onClose}
      footer={{
        primary: {
          text: "Criar",
          onClick: onSubmit,
        },
      }}
    >
      <Stack spacing={2}>
        <FormControl>
          <FormLabel htmlFor="name-field">Nome da categoria</FormLabel>
          <Input
            name="name"
            value={data.name}
            onChange={handleChange}
            fullWidth
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="name-field">Cor da categoria</FormLabel>
          <Input
            name="color"
            value={data.color}
            onChange={handleChange}
            type="color"
            fullWidth
          />
        </FormControl>
      </Stack>
    </Modal>
  );
}
