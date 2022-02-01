import * as React from "react";
import { Button, Box, Text, Stack, IconButton } from "@chakra-ui/react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Modal } from "../../../components/Modal";
import { useCategories } from "../../../contexts/CategoriesContext";
import { NewCategory } from "../NewCategory";

interface ConfigureCategoriesProps {
  open: boolean;
  onClose: () => void;
}

export function ConfigureCategories(props: ConfigureCategoriesProps) {
  const { onClose, open } = props;
  const [newCategory, setNewCategory] = React.useState<boolean>(false);
  const { categories } = useCategories();

  return (
    <>
      {newCategory && (
        <NewCategory open={newCategory} onClose={() => setNewCategory(false)} />
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
