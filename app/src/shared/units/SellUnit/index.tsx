import * as React from "react";
import {
  VStack,
  Input,
  Text,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Modal } from "../../../components/Modal";
import { NewClient } from "../../clients/NewClient";
import { api } from "../../../services/api";
import { Unit } from "../../../pages/Home/types";
import { useForm } from "react-hook-form";
import { Select } from "../../../components/Select";

interface SellUnitProps {
  open: boolean;
  onClose: () => void;
  unit: Unit;
  afterSubmit?: () => void;
}

export function SellUnit(props: SellUnitProps) {
  const { onClose, open, unit, afterSubmit } = props;
  const [clients, setClients] = React.useState([]);
  const { register, handleSubmit, control, setValue } = useForm();
  const toast = useToast();
  const [createClient, setCreateClient] = React.useState<null | string>(null);

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
        sale_date: data.sale_date,
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
    <>
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
            <FormControl>
              <FormLabel htmlFor="client-field">Cliente</FormLabel>
              <Select
                options={clients}
                placeholder="Selecione o cliente"
                control={control}
                name={`client`}
                flex={4}
                onCreate={(text) => setCreateClient("client")}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="value-field">Valor da venda</FormLabel>
              <Input
                id="value-field"
                fullWidth
                {...register("sale_price", { required: true })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="date-field">Data da venda</FormLabel>
              <Input
                type="date"
                id="date-field"
                fullWidth
                {...register("sale_date")}
              />
            </FormControl>
          </VStack>
        </form>
      </Modal>
      {createClient !== null && (
        <NewClient
          open={!!createClient !== null}
          onClose={() => setCreateClient(null)}
          afterSubmit={(data) => {
            setClients((curr) => [
              ...curr,
              { value: data.id, label: data.name },
            ]);
            setValue(createClient as any, data.id);
          }}
        />
      )}
    </>
  );
}
