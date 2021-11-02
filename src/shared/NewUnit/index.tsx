import * as React from "react";
import {
  Grid,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Modal } from "../../components/Modal";
import { api } from "../../services/api";
interface NewUnitProps {
  open: boolean;
  onClose: () => void;
  category: number;
  afterSubmit: () => void;
}

const DATA_INITIAL_STATE = {
  product: null,
  quantity: 1,
  price: null,
};

export function NewUnit(props: NewUnitProps) {
  const { onClose, open, category, afterSubmit } = props;
  const [data, setData] = React.useState<any>(DATA_INITIAL_STATE);
  const [keepGoing, setKeepGoing] = React.useState(false);
  const formRef = React.useRef(null);

  const [products, setProducts] = React.useState([]);

  const searchProducts = (term?: string) => {
    api
      .get("/products")
      .then((res) =>
        setProducts(
          res.data.map((p) => ({ id: p.code, label: p.name, key: p.code }))
        )
      );
  };

  React.useEffect(() => {
    searchProducts();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/units", {
        product: data.product.id,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category: category,
      });

      typeof afterSubmit === "function" && afterSubmit();

      if (keepGoing) {
        setData(DATA_INITIAL_STATE);
      } else {
        onClose();
      }
    } catch (error) {
      alert("Erro ao adicionar unidades");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      title="Incluir unidades"
      footer={{
        primary: {
          text: "Adicionar",
          onClick: () =>
            formRef.current.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            ),
        },
        secondary: { text: "Cancelar", onClick: onClose },
        aditionalAction: (
          <FormControlLabel
            control={
              <Checkbox
                checked={keepGoing}
                onChange={(e) => setKeepGoing(e.target.checked)}
              />
            }
            label="Continuar cadastrando"
          />
        ),
      }}
    >
      <form onSubmit={handleSubmit} ref={formRef}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              value={data.product}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} name="product" label="Produto" />
              )}
              options={products}
              onChange={(_, value) => setData({ ...data, product: value })}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Quantidade"
              name="quantity"
              value={data.quantity}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Valor"
              name="price"
              value={data.price}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
}
