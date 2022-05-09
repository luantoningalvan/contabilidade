import * as React from "react";
import {
  Input,
  Stack,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { Modal } from "../../../components/Modal";
import { api } from "../../../services/api";
import { Controller, useForm } from "react-hook-form";
import { MonthSelector } from "../../../components/MothSelector";

interface EditUnitProps {
  open: boolean;
  onClose: () => void;
  unitId: number;
  afterSubmit: () => void;
}

export function EditUnit(props: EditUnitProps) {
  const { onClose, open, unitId, afterSubmit } = props;
  const [unitData, setUnitData] = React.useState<any>(null);
  const { register, handleSubmit, setValue, control } = useForm();
  const toast = useToast();

  React.useEffect(() => {
    api.get(`units/${unitId}`).then((res) => {
      const { purchase_price, expiration_date, sold, sale_price, sale_date } =
        res.data;

      purchase_price && setValue("price", purchase_price);
      expiration_date && setValue("expiration_date", new Date(expiration_date));

      if (sold) {
        sale_price && setValue("sale_price", sale_price);
        sale_date && setValue("sale_date", sale_date.substring(0, 10));
      }
      setUnitData(res.data);
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.put(`units/${unitId}`, {
        expiration_date: data.expiration_date,
        price: Number(data.price),
        sale_price: Number(data.sale_price),
        sale_date: data.sale_date,
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
            <Stack direction="row" spacing={4}>
              <FormControl flex={1}>
                <FormLabel htmlFor="price-field">Preço de compra</FormLabel>
                <Input
                  fullWidth
                  placeholder="Valor"
                  id="price-field"
                  type="number"
                  {...register(`price`, {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel htmlFor="date-field">Data de vencimento</FormLabel>
                <Controller
                  name={`expiration_date`}
                  control={control}
                  render={({ field }) => (
                    <MonthSelector
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </FormControl>
            </Stack>

            {unitData?.sold && (
              <>
                <div>
                  <Heading size="sm" display="block" mt={4}>
                    Dados da venda
                  </Heading>
                </div>
                <Stack direction="row" spacing={4}>
                  <FormControl flex={1}>
                    <FormLabel htmlFor="value-field">Valor da venda</FormLabel>
                    <Input
                      id="value-field"
                      fullWidth
                      {...register("sale_price", { required: true })}
                    />
                  </FormControl>
                  <FormControl flex={1}>
                    <FormLabel htmlFor="date-field">Data da venda</FormLabel>
                    <Input
                      type="date"
                      id="date-field"
                      fullWidth
                      {...register("sale_date")}
                    />
                  </FormControl>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
