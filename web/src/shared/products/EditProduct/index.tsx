import * as React from "react";
import { Modal } from "../../../components/Modal";
import { useForm } from "react-hook-form";
import { Box, Input, Stack, useToast } from "@chakra-ui/react";
import { api } from "../../../services/api";

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  afterSubmit?: (data: any) => void;
}

export function EditProduct(props: EditProductDialogProps) {
  const { onClose, open, productId, afterSubmit } = props;
  const { register, handleSubmit, setValue, formState } = useForm();
  const [thumb, setThumb] = React.useState<null | string>(null);
  const toast = useToast();

  React.useEffect(() => {
    api.get(`products/${productId}`).then((res) => {
      const { natCode, original_price, name, thumb } = res.data;
      natCode && setValue("natCode", natCode);
      original_price && setValue("original_price", original_price);
      name && setValue("name", name);
      thumb && setThumb(thumb);
    });
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const result = await api.put(`/products/${productId}`, data);

      !!afterSubmit && afterSubmit(result.data);

      toast({ status: "success", title: "Produto editado com sucesso" });

      onClose();
    } catch (error) {
      toast({ status: "error", title: error.response.data.message });
    }
  };

  return (
    <Modal
      open={open}
      size="lg"
      onClose={onClose}
      title="Editar produto"
      footer={{
        primary: {
          text: "Editar",
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
