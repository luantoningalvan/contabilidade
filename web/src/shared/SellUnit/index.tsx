import * as React from "react";
import { VStack, Input, Heading } from "@chakra-ui/react";
import { Modal } from "../../components/Modal";
import { api } from "../../services/api";
import { Unit } from "../../pages/Home/types";

interface SellUnitProps {
  open: boolean;
  onClose: () => void;
  unit: Unit;
  afterSubmit?: () => void;
}

export function SellUnit(props: SellUnitProps) {
  const { onClose, open, unit, afterSubmit } = props;
  const formRef = React.useRef(null);
  const [data, setData] = React.useState<any>({
    sale_price: undefined,
    client: null,
  });
  const [clients, setClients] = React.useState([]);

  const searchClients = (term?: string) => {
    api
      .get("/clients")
      .then((res) =>
        setClients(
          res.data.map((p) => ({ id: p.id, label: p.name, key: p.id }))
        )
      );
  };

  React.useEffect(() => {
    searchClients();
  }, [unit]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/units/${unit.id}/sell`, {
        sale_price: Number(data.sale_price),
        client: data.client.id,
      });

      typeof afterSubmit === "function" && afterSubmit();

      onClose();
    } catch (error) {
      alert("Erro ao vender unidade");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Vender`}
      footer={{
        primary: {
          text: "Vender",
          onClick: () =>
            formRef.current.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            ),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <form onSubmit={handleSubmit} ref={formRef}>
        <VStack spacing={2}>
          <Heading variant="body2">{unit.name}</Heading>
          {/* <Autocomplete
              value={data.client}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} name="client" label="Cliente" />
              )}
              options={clients}
              onChange={(_, value) => setData({ ...data, client: value })}
            /> */}
          <Input
            label="Valor da venda"
            name="sale_price"
            value={data.sale_price}
            onChange={handleChange}
            fullWidth
          />
        </VStack>
      </form>
    </Modal>
  );
}