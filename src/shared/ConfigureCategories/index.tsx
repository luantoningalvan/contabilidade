import { Button, Grid, IconButton, TextField } from "@mui/material";
import * as React from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { Modal } from "../../components/Modal";
import { Category } from "../../containers/Home/types";
import { useCategories } from "../../contexts/CategoriesContext";
import { api } from "../../services/api";
import { CategoryItem, Circle } from "./styles";
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
      maxWidth="xs"
      fullWidth
      footer={{
        primary: {
          text: "Criar",
          onClick: onSubmit,
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            value={data.name}
            onChange={handleChange}
            label="Nome da categoria"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="color"
            value={data.color}
            onChange={handleChange}
            label="Cor"
            type="color"
            fullWidth
          />
        </Grid>
      </Grid>
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

      <Modal
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        title="Configurar categorias"
      >
        <div>
          {categories.map((category) => (
            <CategoryItem key={category.id}>
              <div>
                <Circle color={category.color} />
                <span>{category.name}</span>
              </div>

              <IconButton>
                <FiEdit />
              </IconButton>
            </CategoryItem>
          ))}
          <Button
            size="large"
            variant="outlined"
            startIcon={<FiPlus />}
            fullWidth
            style={{ marginTop: "2rem" }}
            onClick={() => setNewCategory(true)}
          >
            Nova categoria
          </Button>
        </div>
      </Modal>
    </>
  );
}
