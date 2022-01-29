import * as React from "react";
import { Input, Text, Stack, useToast } from "@chakra-ui/react";
import { Modal } from "../../components/Modal";
import { api } from "../../services/api";
import io, { Socket } from "socket.io-client";
import { Select, CreatableSelect } from "chakra-react-select";
import { NewProduct } from "../NewProduct";
import { useForm } from "react-hook-form";

interface NewUnitProps {
  open: boolean;
  onClose: () => void;
  barCode: string;
  afterSubmit?: (data: any) => void;
}

const DATA_INITIAL_STATE = {
  product: null,
  quantity: 1,
  price: null,
};

export function AssociateProduct(props: NewUnitProps) {
  const { onClose, open, afterSubmit, barCode } = props;
  const [products, setProducts] = React.useState([]);
  const [newProduct, setNewProduct] = React.useState(false);
  const toast = useToast();
  const [selectedProduct, setSelectedProduct] = React.useState(null);

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

  const onSubmit = async () => {
    try {
      const result = await api.patch(
        `products/${selectedProduct.value}/barcode`,
        {
          barCode,
        }
      );

      typeof afterSubmit === "function" && afterSubmit(result.data);

      toast({ status: "success", title: "Produto vinculado com sucesso" });

      onClose();
    } catch (error) {
      toast({ status: "error", title: "Erro ao vincular unidade" });
    }
  };

  return (
    <>
      <Modal
        title="Vincular produto"
        open={open}
        onClose={onClose}
        footer={{
          primary: { text: "Vincular", onClick: onSubmit },
          secondary: { text: "Cancelar", onClick: onClose },
        }}
      >
        <Stack spacing={4}>
          <Text>
            Esse código de barras não está vinculado a nenhum produto. Selecione
            o produto relacionado abaixo.
          </Text>
          <CreatableSelect
            options={products}
            placeholder="Produto"
            onChange={(v) => setSelectedProduct(v)}
            value={selectedProduct}
            onCreateOption={() => setNewProduct(true)}
          />
        </Stack>
      </Modal>

      {newProduct && (
        <NewProduct
          open={newProduct}
          onClose={() => setNewProduct(false)}
          afterSubmit={(data) => {
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
