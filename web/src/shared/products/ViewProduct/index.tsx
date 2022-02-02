import * as React from "react";
import { Modal } from "../../../components/Modal";
import {
  Avatar,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { api } from "../../../services/api";
import { FiBox, FiCheckSquare, FiEdit } from "react-icons/fi";
import { BsQuestionDiamond } from "react-icons/bs";
import { formatToBrl } from "../../../utils/formatToBrl";
import { EmptyState } from "../../../components/EmptyState";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { EditProduct } from "../EditProduct";

interface ViewProdutoProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  afterDelete?: () => void;
}

export function ViewProduct(props: ViewProdutoProps) {
  const { onClose, open, productId, afterDelete } = props;
  const [productData, setProductData] = React.useState(null);
  const [editProduct, setEditProduct] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const confirm = useConfirmation();
  const toast = useToast();

  console.log(productData);

  React.useEffect(() => {
    setLoading(true);
    api
      .get(`products/${productId}`)
      .then((res) => setProductData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = React.useCallback(async () => {
    confirm({
      title: "Excluir produto",
      description:
        "Ao excluir esse produto TODAS UNIDADES serão excluídas e você perderá o histórico de vendas",
    }).then(async () => {
      try {
        await api.delete(`/products/${productId}`);
        toast({ status: "success", title: "Produto removido" });
        !!afterDelete && afterDelete();
        onClose();
      } catch (error) {
        toast({ status: "error", title: error.response.data });
      }
    });
  }, []);

  return (
    <>
      <Modal
        open={open}
        loading={loading}
        size="2xl"
        onClose={onClose}
        title={productData?.name}
      >
        <Grid gridTemplateColumns="2fr 4fr" gap={12} mb={4}>
          <GridItem>
            <Stack spacing={4} alignItems="center">
              {productData?.thumb ? (
                <Image w="full" h="full" src={productData?.thumb} />
              ) : (
                <Box
                  w="full"
                  h="200px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={1}
                  rounded={2}
                >
                  <BsQuestionDiamond size={64} />
                </Box>
              )}

              <Box>
                <Button
                  onClick={() => setEditProduct(true)}
                  leftIcon={<FiEdit />}
                  colorScheme="blue"
                  isFullWidth
                >
                  Editar
                </Button>
                <Button
                  onClick={handleDelete}
                  colorScheme="red"
                  variant="ghost"
                  isFullWidth
                  mt={2}
                >
                  Excluir
                </Button>
              </Box>
            </Stack>
          </GridItem>
          <GridItem>
            <Heading size="md">Unidades</Heading>

            {productData?.units.length ? (
              <Table mt={4}>
                <Thead>
                  <Th>Preço</Th>
                  <Th>Vencimento</Th>
                  <Th textAlign="center">Vendido</Th>
                </Thead>
                <Tbody>
                  {productData?.units.map((unit) => (
                    <Tr key={unit.id}>
                      <Td>{formatToBrl(unit.purchase_price)}</Td>
                      <Td>{unit.expiration_date}</Td>
                      <Td textAlign="center">
                        {unit.sold && (
                          <FiCheckSquare
                            size={18}
                            color="#188d4f"
                            style={{ display: "inline-block" }}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <EmptyState
                h="300px"
                icon={FiBox}
                title="Nenhuma unidade"
                description="Cadastre unidades desse produto na página Unidades "
              />
            )}
          </GridItem>
        </Grid>
      </Modal>
      {editProduct && (
        <EditProduct
          open={editProduct}
          onClose={() => setEditProduct(false)}
          afterSubmit={(res) => setProductData((curr) => ({ ...curr, ...res }))}
          productId={productId}
        />
      )}
    </>
  );
}
