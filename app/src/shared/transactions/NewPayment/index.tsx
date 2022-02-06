import * as React from "react";
import { Modal } from "../../../components/Modal";
import { FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
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
          type: 1,
          description: "Pagamento realizado",
          value: data.value,
        });

        toast({ status: "success", title: "Pagamento realizado" });

        !!afterSubmit && afterSubmit();
        onClose();
      } catch (error) {
        toast({ status: "error", title: "Erro ao realizar pagamento" });
      }
    },
    [clientId, toast]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo pagamento"
      footer={{
        primary: {
          text: "Realizar pagamento",
          onClick: handleSubmit(onSubmit),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor="value-field">Valor do pagamento</FormLabel>

          <Input
            id="value-field"
            placeholder="R$ 0,00"
            {...register("value", { valueAsNumber: true })}
          />
        </FormControl>
      </form>
    </Modal>
  );
}
