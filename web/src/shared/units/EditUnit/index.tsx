import * as React from "react";
import {
  Input,
  Stack,
  Select,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { Modal } from "../../../components/Modal";
import { api } from "../../../services/api";
import { useForm } from "react-hook-form";

interface EditUnitProps {
  open: boolean;
  onClose: () => void;
  unitId: number;
  afterSubmit: () => void;
}

export function EditUnit(props: EditUnitProps) {
  const { onClose, open, unitId, afterSubmit } = props;
  const [unitData, setUnitData] = React.useState<any>(null);
  const { register, handleSubmit, setValue } = useForm();
  const toast = useToast();

  React.useEffect(() => {
    api.get(`units/${unitId}`).then((res) => {
      setValue("price", res.data.purchase_price);
      setValue("expiration_date", res.data.expiration_date.substring(0, 10));
      setUnitData(res.data);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.put(`units/${unitId}`, {
        expiration_date: data.expiration_date,
        price: Number(data.price),
      });

      toast({ status: "success", title: "Unidade atualizada" });

      typeof afterSubmit === "function" && afterSubmit();

      onClose();
    } catch (error) {
      toast({ status: "error", title: "Erro ao atualizar unidade" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar unidade"
      footer={{
        primary: {
          text: "Editar",
          onClick: handleSubmit(onSubmit),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="product-field">Produto</FormLabel>
              <Select flex={4} isDisabled id="product-field">
                <option value={unitData?.product.id}>
                  {unitData?.product.name}
                </option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="price-field">Preço de compra</FormLabel>
              <Input
                fullWidth
                placeholder="Valor"
                id="price-field"
                {...register(`price`, {
                  valueAsNumber: true,
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="date-field">Data de vencimento</FormLabel>
              <Input
                type="date"
                placeholder="Data vencimento"
                id="date-field"
                {...register(`expiration_date`)}
              />
            </FormControl>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
