import { FormControl, FormLabel, Input, Stack, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Modal } from "../../../components/Modal";
import { useCategories } from "../../../contexts/CategoriesContext";
import { api } from "../../../services/api";

interface EditCategoryProps {
  open: boolean;
  onClose: () => void;
  categoryId: number;
}

export function EditCategory(props: EditCategoryProps) {
  const { categoryId } = props;
  const [data, setData] = React.useState<any>({ color: "#000", name: "" });
  const { updateCategory } = useCategories();
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    try {
      await updateCategory(categoryId, data);
      props.onClose();
    } catch (error) {
      alert("Erro ao editar categoria");
    }
  };

  const fetchCategory = React.useCallback(async () => {
    setLoading(true);
    const res = await api.get(`categories/${categoryId}`);
    setData(res.data);
    setLoading(false);
  }, [categoryId]);

  React.useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return (
    <Modal
      title="Editar categoria"
      open={props.open}
      onClose={props.onClose}
      footer={{
        primary: {
          text: "Editar",
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
