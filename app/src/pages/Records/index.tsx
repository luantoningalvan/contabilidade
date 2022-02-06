import { Layout } from "../../components/Layout";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Box,
  Heading,
} from "@chakra-ui/react";
import { Products } from "./Products";
import { Clients } from "./Clients";

export function Records() {
  return (
    <Layout>
      <Tabs variant="soft-rounded" colorScheme="purple" isLazy>
        <Box
          display="flex"
          alignItems="center"
          gap={4}
          h={["112px", "56px"]}
          p={4}
          borderBottomWidth={1}
          flexDir={["column", "row"]}
        >
          <Heading size="md">Central de cadastros</Heading>
          <TabList>
            <Tab>Produtos</Tab>
            <Tab>Clientes</Tab>
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel>
            <Products />
          </TabPanel>
          <TabPanel>
            <Clients />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}
