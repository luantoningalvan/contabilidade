import * as React from "react";
import { Modal } from "../../../components/Modal";
import {
  FormControl,
  Select,
  FormLabel,
  Input,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../../../services/api";

interface NewPaymentProps {
  open: boolean;
  onClose: () => void;
  clientId: number;
  afterSubmit?: () => void;
}

export function NewPayment(props: NewPaymentProps) {
  const { onClose, open, clientId, afterSubmit } = props;
  const { register, handleSubmit } = useForm();
  const toast = useToast();

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        await api.post("/transactions", {
          client: clientId,
          type: Number(data.type),
          description:
            data.type === "1" ? "Pagamento realizado" : "Despesa avulsa",
          value: data.value,
        });

        toast({ status: "success", title: "Lançamento realizado" });

        !!afterSubmit && afterSubmit();
        onClose();
      } catch (error) {
        toast({ status: "error", title: "Erro ao realizar lançamento" });
      }
    },
    [clientId, toast]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo lançamento"
      footer={{
        primary: {
          text: "Realizar lançamento",
          onClick: handleSubmit(onSubmit),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="type-field">Tipo do lançamento</FormLabel>

            <Select defaultValue={1} id="type-field" {...register("type")}>
              <option value={1}>Entrada</option>
              <option value={2}>Saída</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="value-field">Valor do lançamento</FormLabel>

            <Input
              id="value-field"
              placeholder="R$ 0,00"
              {...register("value", { valueAsNumber: true })}
            />
          </FormControl>
        </Stack>
      </form>
    </Modal>
  );
}
