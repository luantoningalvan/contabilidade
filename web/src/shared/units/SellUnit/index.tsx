import * as React from "react";
import { VStack, Input, Text, Select, useToast } from "@chakra-ui/react";
import { Modal } from "../../../components/Modal";
import { api } from "../../../services/api";
import { Unit } from "../../../pages/Home/types";
import { useForm } from "react-hook-form";

interface SellUnitProps {
  open: boolean;
  onClose: () => void;
  unit: Unit;
  afterSubmit?: () => void;
}

export function SellUnit(props: SellUnitProps) {
  const { onClose, open, unit, afterSubmit } = props;
  const [clients, setClients] = React.useState([]);
  const { register, handleSubmit } = useForm();
  const toast = useToast();

  console.log(unit);
  const searchClients = (term?: string) => {
    api
      .get("/clients")
      .then((res) =>
        setClients(res.data.map((p) => ({ value: p.id, label: p.name })))
      );
  };

  React.useEffect(() => {
    searchClients();
  }, [unit]);

  const onSubmit = async (data) => {
    try {
      await api.post(`/units/${unit.id}/sell`, {
        sale_price: Number(data.sale_price),
        client: Number(data.client),
      });

      toast({ status: "success", title: "Venda realizada com sucesso" });

      typeof afterSubmit === "function" && afterSubmit();

      onClose();
    } catch (error) {
      toast({ status: "error", title: "Erro ao vender produto" });
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
          onClick: handleSubmit(onSubmit),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={2} align="start">
          <Text fontSize="lg" mb={2}>
            {unit.name}
          </Text>
          <Select
            flex={4}
            placeholder="Selecione o cliente"
            {...register("client")}
          >
            {clients.map((client) => (
              <option key={client.value} value={client.value}>
                {client.label}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Valor da venda"
            fullWidth
            {...register("sale_price")}
          />
        </VStack>
      </form>
    </Modal>
  );
}
