import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Input,
  Text,
  InputLeftElement,
  InputGroup,
  Image,
} from "@chakra-ui/react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { NewProduct } from "../../../shared/NewProduct";
type Product = {
  id: number;
  name: string;
  thumb: string;
  totalUnits: number;
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductDialog, setNewProductDialog] = useState(false);

  const fetchProducts = useCallback(() => {
    api.get("products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      {newProductDialog && (
        <NewProduct
          open={newProductDialog}
          onClose={() => setNewProductDialog(false)}
          afterSubmit={fetchProducts}
        />
      )}
      <div>
        <Box display="flex" justifyContent="space-between">
          <InputGroup>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input placeholder="Buscar produto" width="auto" />
          </InputGroup>
          <Button
            colorScheme="purple"
            onClick={() => setNewProductDialog(true)}
            leftIcon={<FiPlus />}
          >
            Novo produto
          </Button>
        </Box>

        <SimpleGrid columns={5} spacing={4} mt={4}>
          {products.map((product) => (
            <Box
              key={product.id}
              display="flex"
              borderWidth={1}
              rounded={6}
              cursor="pointer"
            >
              <Image
                roundedBottomLeft={4}
                roundedTopLeft={6}
                src={product.thumb}
                alt={product.name}
                h="145px"
              />
              <Box
                p={4}
                display="flex"
                justifyContent="center"
                flexDirection="column"
                bg="gray.50"
              >
                <Heading size="sm" noOfLines={3} mb={2}>
                  {product.name}
                </Heading>
                <Text color="gray.600">{product.totalUnits} unidades</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </div>
    </>
  );
}
