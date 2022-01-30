import * as React from "react";
import { Modal } from "../../../components/Modal";
import {
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
} from "@chakra-ui/react";
import { api } from "../../../services/api";
import { FiCheckCircle } from "react-icons/fi";
import { formatToBrl } from "../../../utils/formatToBrl";

interface ViewProdutoProps {
  open: boolean;
  onClose: () => void;
  productId: number;
}

export function ViewProduct(props: ViewProdutoProps) {
  const { onClose, open, productId } = props;
  const [productData, setProductData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    api
      .get(`products/${productId}`)
      .then((res) => setProductData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Modal
      open={open}
      loading={loading}
      size="lg"
      onClose={onClose}
      title={productData?.name}
    >
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Gerais</Tab>
          <Tab>Unidades</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <img src={productData?.thumb} alt={productData?.name} />
          </TabPanel>
          <TabPanel>
            <Table>
              <Thead>
                <Th>Preço</Th>
                <Th>Vencimento</Th>
                <Th>Vendido</Th>
              </Thead>
              <Tbody>
                {productData?.units.map((unit) => (
                  <Tr key={unit.id}>
                    <Td>{formatToBrl(unit.purchase_price)}</Td>
                    <Td>{unit.expiration_date}</Td>
                    <Td>{unit.sold && <FiCheckCircle color="#0f7" />}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Modal>
  );
}
