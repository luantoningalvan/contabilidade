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
import { NewProduct } from "../../../shared/products/NewProduct";
import { ViewProduct } from "../../../shared/products/ViewProduct";
import { EmptyState } from "../../../components/EmptyState";
import { BiBasket } from "react-icons/bi";
import { debounce } from "../../../utils/debounce";
import { parseOptions } from "../../../utils/parseOptions";

type Product = {
  id: number;
  name: string;
  thumb: string;
  totalUnits: number;
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductDialog, setNewProductDialog] = useState(false);
  const [viewProductDialog, setViewProductDialog] = useState<null | number>(
    null
  );
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(() => {
    const options = parseOptions(filters);

    api.get(`products?${options}`).then((res) => {
      setProducts(res.data);
    });
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = debounce((txt: string) => {
    setFilters((curr) => ({ ...curr, search: txt }));
  });

  return (
    <>
      {newProductDialog && (
        <NewProduct
          open={newProductDialog}
          onClose={() => setNewProductDialog(false)}
          afterSubmit={fetchProducts}
        />
      )}

      {viewProductDialog && (
        <ViewProduct
          open={!!viewProductDialog}
          onClose={() => setViewProductDialog(null)}
          productId={viewProductDialog}
        />
      )}

      <div>
        <Box
          display="flex"
          gap={2}
          flexDir={["column-reverse", "row"]}
          justifyContent="space-between"
        >
          <InputGroup width={["100%", "auto"]}>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input
              placeholder="Buscar produto"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            colorScheme="purple"
            onClick={() => setNewProductDialog(true)}
            leftIcon={<FiPlus />}
            minW="auto"
          >
            Novo produto
          </Button>
        </Box>

        {products.length > 0 ? (
          <SimpleGrid columns={[1, 2, null, 3, 3, 5]} spacing={4} mt={4}>
            {products.map((product) => (
              <Box
                key={product.id}
                display="flex"
                borderWidth={1}
                rounded={6}
                cursor="pointer"
                onClick={() => setViewProductDialog(product.id)}
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
        ) : (
          <EmptyState
            icon={BiBasket}
            title={
              Object.values(filters).filter((v) => !!v).length > 0
                ? "Nenhum produto que corresponda a busca"
                : "Nenhum produto encontrado"
            }
            description="É necessário cadastrar seus produtos para poder incluir unidades"
            action={{
              text: "Cadastrar produto",
              onClick: () => setNewProductDialog(true),
            }}
          />
        )}
      </div>
    </>
  );
}
