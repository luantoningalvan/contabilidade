import * as React from "react";
import { Modal } from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { Box, Input, Stack, useToast } from "@chakra-ui/react";
import { api } from "../../../services/api";
import { debounce } from "../../../utils/debounce";

interface NewProductDialogProps {
  open: boolean;
  onClose: () => void;
  afterSubmit?: (data: any) => void;
}

export function NewProduct(props: NewProductDialogProps) {
  const { onClose, open, afterSubmit } = props;
  const { register, watch, handleSubmit, setValue, formState } = useForm();
  const [thumb, setThumb] = React.useState<null | string>(null);
  const toast = useToast();

  const onSubmit = async (data: any) => {
    try {
      const result = await api.post("products", data);

      !!afterSubmit && afterSubmit(result.data);

      toast({ status: "success", title: "Produto inserido com sucesso" });

      onClose();
    } catch (error) {
      toast({ status: "error", title: error.response.data.message });
    }
  };

  const findProduct = debounce(async (natCode: string) => {
    const findInfo = await api.get(`products/info/${natCode}`);

    if (findInfo.data.imageUrl) {
      setThumb(findInfo.data.imageUrl);
    }
    if (findInfo.data.title) {
      setValue("name", findInfo.data.title);
    }
  }, 500);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "natCode") findProduct(value.natCode);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Modal
      open={open}
      size="lg"
      onClose={onClose}
      title="Incluir produto"
      footer={{
        primary: {
          text: "Adicionar",
          onClick: handleSubmit(onSubmit),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <Stack direction="row" spacing={4}>
        <Box w={180} rounded={4} borderStyle="dotted" borderWidth={4}>
          {thumb && <img src={thumb} alt="Imagem do produto" />}
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Stack>
            <Input
              placeholder="Código natura"
              isInvalid={formState.errors.natCode}
              {...register("natCode", { required: true })}
            />
            <Input
              placeholder="Nome do produto"
              isInvalid={formState.errors.name}
              {...register("name", { required: true })}
            />
            <Input
              placeholder="Preço base"
              {...register("original_price", { valueAsNumber: true })}
            />
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
