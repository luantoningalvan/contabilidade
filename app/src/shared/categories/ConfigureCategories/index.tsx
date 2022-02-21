import * as React from "react";
import { Button, Box, Text, Stack, IconButton } from "@chakra-ui/react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Modal } from "../../../components/Modal";
import { useCategories } from "../../../contexts/CategoriesContext";
import { NewCategory } from "../NewCategory";
import { EditCategory } from "../EditCategory";

interface ConfigureCategoriesProps {
  open: boolean;
  onClose: () => void;
}

export function ConfigureCategories(props: ConfigureCategoriesProps) {
  const { onClose, open } = props;
  const [newCategory, setNewCategory] = React.useState<boolean>(false);
  const [editCategory, setEditCategory] = React.useState<null | number>(null);
  const { categories } = useCategories();

  return (
    <>
      {editCategory && (
        <EditCategory
          open={!!editCategory}
          onClose={() => setEditCategory(null)}
          categoryId={editCategory}
        />
      )}

      {newCategory && (
        <NewCategory open={newCategory} onClose={() => setNewCategory(false)} />
      )}

      <Modal open={open} onClose={onClose} title="Configurar categorias">
        <Box>
          <Stack>
            {categories.map((category) => (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                key={category.id}
                _hover={{ bg: "gray.50" }}
                rounded={4}
                p={1}
              >
                <Box display="flex" gap={4}>
                  <Box
                    h="1.5rem"
                    w="1.5rem"
                    rounded="full"
                    bg={category.color}
                  />
                  <Text>{category.name}</Text>
                </Box>

                <IconButton
                  onClick={() => setEditCategory(category.id)}
                  aria-label="Editar"
                  size="sm"
                >
                  <FiEdit />
                </IconButton>
              </Box>
            ))}
          </Stack>
          <Button
            colorScheme="purple"
            variant="outline"
            isFullWidth
            my={4}
            leftIcon={<FiPlus />}
            onClick={() => setNewCategory(true)}
          >
            Nova categoria
          </Button>
        </Box>
      </Modal>
    </>
  );
}
