import * as React from "react";
import {
  VStack,
  Button,
  Input,
  Box,
  Text,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Modal } from "../../components/Modal";
import { useCategories } from "../../contexts/CategoriesContext";

interface ConfigureCategoriesProps {
  open: boolean;
  onClose: () => void;
}

function CategoryModal(props: ConfigureCategoriesProps) {
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
      <VStack container spacing={2}>
        <Input
          name="name"
          value={data.name}
          onChange={handleChange}
          fullWidth
        />
        <Input
          name="color"
          value={data.color}
          onChange={handleChange}
          type="color"
          fullWidth
        />
      </VStack>
    </Modal>
  );
}

export function ConfigureCategories({
  onClose,
  open,
}: ConfigureCategoriesProps) {
  const [newCategory, setNewCategory] = React.useState<boolean>(false);
  const { categories } = useCategories();

  return (
    <>
      {newCategory && (
        <CategoryModal
          open={newCategory}
          onClose={() => setNewCategory(false)}
        />
      )}

      <Modal open={open} onClose={onClose} title="Configurar categorias">
        <Stack spacing={4} mb={4}>
          {categories.map((category) => (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              key={category.id}
              _hover={{ bg: "gray.50" }}
              p={2}
              rounded={4}
            >
              <Box display="flex" gap={4}>
                <Box h="1.5rem" w="1.5rem" rounded="full" bg={category.color} />
                <Text>{category.name}</Text>
              </Box>

              <IconButton aria-label="Editar">
                <FiEdit />
              </IconButton>
            </Box>
          ))}
          <Button
            colorScheme="purple"
            variant="outline"
            leftIcon={<FiPlus />}
            onClick={() => setNewCategory(true)}
          >
            Nova categoria
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
