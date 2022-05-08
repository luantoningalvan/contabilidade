import * as React from "react";
import { Modal } from "../../../components/Modal";
import { Controller, useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { api } from "../../../services/api";
import { debounce } from "../../../utils/debounce";
import { ImageUploadField } from "../../../components/ImageUploadField";
import { Buffer } from "buffer";
import { fileToBase64 } from "../../../utils/fileToBase64";

interface NewProductDialogProps {
  open: boolean;
  onClose: () => void;
  afterSubmit?: (data: any) => void;
}

export function NewProduct(props: NewProductDialogProps) {
  const { onClose, open, afterSubmit } = props;
  const { register, watch, handleSubmit, setValue, formState, control } =
    useForm();
  const toast = useToast();

  const onSubmit = async (data: any) => {
    try {
      const thumbnail = !!data.thumbnail
        ? await fileToBase64(data.thumbnail).then(
            (base64: string) => base64.split("data:image/jpg;base64,")[1]
          )
        : undefined;

      let requestData = {
        name: data.name,
        natCode: data.natCode,
        thumbnail,
      };

      const result = await api.post("products", requestData);

      !!afterSubmit && afterSubmit(result.data);

      toast({ status: "success", title: "Produto inserido com sucesso" });

      onClose();
    } catch (error) {
      toast({ status: "error", title: error.response.data.message });
    }
  };

  const findProduct = debounce(async (natCode: string) => {
    if (natCode.length < 3) return;
    const findInfo = await api.get(`products/info/${natCode}`);

    if (findInfo.data.thumbnail) {
      const base64ToBuffer = Buffer.from(findInfo.data.thumbnail, "base64");
      const file = new File([base64ToBuffer], `${natCode}.jpg`, {
        type: "image/jpg",
      });
      setValue("thumbnail", file);
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
      size="xl"
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
        <Controller
          name="thumbnail"
          control={control}
          render={({ field }) => (
            <ImageUploadField onChange={field.onChange} value={field.value} />
          )}
        />
        <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1 }}>
          <Stack>
            <FormControl>
              <FormLabel htmlFor="natCode-field">Código do produto</FormLabel>

              <Input
                id="natCode-field"
                isInvalid={formState.errors.natCode}
                {...register("natCode")}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="name-field">Nome do produto</FormLabel>

              <Input
                id="name-field"
                isInvalid={formState.errors.name}
                {...register("name", { required: true })}
              />
            </FormControl>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}
