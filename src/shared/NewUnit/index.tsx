import * as React from "react";
import { Input, Stack } from "@chakra-ui/react";
import { Modal } from "../../components/Modal";
import { api } from "../../services/api";
import io, { Socket } from "socket.io-client";
import { Select } from "chakra-react-select";
import { AssociateProduct } from "./associateProduct";
import { useForm } from "react-hook-form";

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
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const { register, handleSubmit, setValue } = useForm();

  React.useEffect(() => {
    const socket = io("http://127.0.0.1:3333");

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    socket.on("newProductScanned", (data) => {
      if (data.isAssociated) {
        setValue("quantity", 1);
        setValue("price", data.product.original_price);
        setSelectedProduct({
          label: data.product.name,
          value: data.product.id,
        });
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
      console.log(selectedProduct);
      await api.post("/units", {
        product: selectedProduct.value,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category: category,
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
        size="3xl"
        footer={{
          primary: {
            text: "Adicionar",
            onClick: handleSubmit(onSubmit),
          },
          secondary: { text: "Cancelar", onClick: onClose },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" spacing={2}>
            <div style={{ width: "100%" }}>
              <Select
                options={products}
                placeholder="Produto"
                onChange={(v) => setSelectedProduct(v)}
                value={selectedProduct}
              />
            </div>
            <Input
              label="Quantidade"
              type="number"
              placeholder="Quantidade"
              {...register("quantity", { valueAsNumber: true })}
            />
            <Input
              label="Valor"
              fullWidth
              placeholder="Valor"
              {...register("price", { valueAsNumber: true })}
            />
          </Stack>
        </form>
      </Modal>
      {associateProduct && (
        <AssociateProduct
          open={!!associateProduct}
          onClose={() => setAssociateProducts(null)}
          barCode={associateProduct}
          afterSubmit={(data) => {
            setValue("quantity", 1);
            setValue("price", data.original_price);
            setSelectedProduct({
              label: data.name,
              value: data.id,
            });
          }}
        />
      )}
    </>
  );
}
