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

export function Records() {
  return (
    <Layout>
      <Tabs variant="soft-rounded" colorScheme="purple">
        <Box
          display="flex"
          alignItems="center"
          gap={4}
          h="56px"
          p={4}
          borderBottomWidth={1}
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
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
}
