import * as React from "react";
import { Input, Stack } from "@chakra-ui/react";
import { Modal } from "../../../components/Modal";
import { api } from "../../../services/api";
import io, { Socket } from "socket.io-client";
import { NewProduct } from "../../products/NewProduct";
import { AssociateProduct } from "./associateProduct";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Select } from "../../../components/Select";
import { MonthSelector } from "../../../components/MothSelector";

interface NewUnitProps {
  open: boolean;
  onClose: () => void;
  category: number;
  afterSubmit: () => void;
}

export function NewUnit(props: NewUnitProps) {
  const { onClose, open, category, afterSubmit } = props;
  const socketRef = React.useRef<Socket>();
  const [products, setProducts] = React.useState([]);

  const [associateProduct, setAssociateProducts] = React.useState<
    null | string
  >(null);

  const [createProduct, setCreateProduct] = React.useState<null | string>(null);

  const { register, handleSubmit, setValue, control, getValues } = useForm({
    defaultValues: {
      products: [
        {
          product: undefined,
          quantity: undefined,
          price: undefined,
          expiration_date: undefined,
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "products",
  });

  const includeUnit = (data) => {
    const values = getValues();

    const findSameProduct = values.products.findIndex(
      (field) => Number(field.product) === data.product.id
    );

    if (!values.products[0].product) {
      return setValue(`products.${0}`, {
        quantity: 1,
        expiration_date: undefined,
        price: data.product.original_price,
        product: data.product.id,
      });
    }

    if (findSameProduct !== -1) {
      setValue(`products.${findSameProduct}`, {
        ...values.products[findSameProduct],
        quantity: values.products[findSameProduct].quantity + 1,
      });
    } else {
      append({
        quantity: 1,
        expiration_date: undefined,
        price: data.product.original_price,
        product: data.product.id,
      });
    }
  };

  React.useEffect(() => {
    const socket = io("http://127.0.0.1:3333");

    socket.on("newProductScanned", (data) => {
      if (data.isAssociated) {
        includeUnit(data);
      } else {
        setAssociateProducts(data.code);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const searchProducts = (term?: string) => {
    api
      .get("/products")
      .then((res) =>
        setProducts(res.data.map((p) => ({ value: p.id, label: p.name })))
      );
  };

  React.useEffect(() => {
    searchProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/units", {
        products: data.products.map((product) => ({
          product: product.product,
          expiration_date: product.expiration_date,
          price: Number(product.price),
          quantity: Number(product.quantity),
          category: category,
        })),
      });

      typeof afterSubmit === "function" && afterSubmit();

      onClose();
    } catch (error) {
      alert("Erro ao adicionar unidades");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Incluir unidades"
        size="4xl"
        footer={{
          primary: {
            text: "Adicionar",
            onClick: handleSubmit(onSubmit),
          },
          secondary: { text: "Cancelar", onClick: onClose },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={2}>
                <Select
                  options={products}
                  placeholder="Selecione o produto"
                  control={control}
                  name={`products.${index}.product`}
                  flex={4}
                  onCreate={(text) =>
                    setCreateProduct(`products.${index}.product`)
                  }
                />

                <Input
                  type="number"
                  placeholder="Qnt."
                  flex={1}
                  {...register(`products.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
                <Input
                  fullWidth
                  placeholder="Valor"
                  flex={1}
                  {...register(`products.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />
                <Controller
                  name={`products.${index}.expiration_date`}
                  control={control}
                  render={({ field }) => (
                    <MonthSelector
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </Stack>
            ))}
          </Stack>
        </form>
      </Modal>

      {associateProduct && (
        <AssociateProduct
          open={!!associateProduct}
          onClose={() => setAssociateProducts(null)}
          barCode={associateProduct}
          afterSubmit={(data) => includeUnit({ product: data })}
        />
      )}

      {createProduct !== null && (
        <NewProduct
          open={!!createProduct !== null}
          onClose={() => setCreateProduct(null)}
          afterSubmit={(data) => {
            setProducts((curr) => [
              ...curr,
              { value: data.id, label: data.name },
            ]);
            setValue(createProduct as any, data.id);
          }}
        />
      )}
    </>
  );
}
