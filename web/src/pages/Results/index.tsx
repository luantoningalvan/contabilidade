import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Stack,
  Avatar,
  Flex,
  Divider,
  Table,
  Thead,
  Th,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { Layout } from "../../components/Layout";
import { formatToBrl } from "../../utils/formatToBrl";

export function Results() {
  return (
    <Layout>
      <Grid p={8} gap={8} templateColumns="repeat(8, 1fr)">
        <GridItem colSpan={2}>
          <Box bg="gray.200" w="full">
            <Text>Total em vendas</Text>
            <Heading>{formatToBrl(2700)}</Heading>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box bg="gray.200" w="full">
            <Text>Lucro</Text>
            <Heading>{formatToBrl(12956)}</Heading>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box bg="gray.200" w="full">
            <Text>Total a receber</Text>
            <Heading>{formatToBrl(12956)}</Heading>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box bg="gray.200" w="full">
            <Text>Novos clientes</Text>
            <Heading>+ 23</Heading>
          </Box>
        </GridItem>
        <GridItem colSpan={4}>
          <Box bg="gray.200" w="full">
            <Heading size="md">Total de vendas por mês</Heading>

            <ReactApexChart
              height={310}
              options={{
                chart: {
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                  toolbar: { show: false },
                },
                dataLabels: {
                  enabled: false,
                },
                legend: { show: false },
                stroke: {
                  curve: "straight",
                },

                xaxis: {
                  categories: [
                    "Jan",
                    "Fev",
                    "Mar",
                    "Abr",
                    "Mai",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Set",
                    "Out",
                    "Nov",
                    "Dez",
                  ],
                },
              }}
              series={[
                {
                  name: "Vendas",
                  data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 234, 175, 230],
                },
              ]}
              type="line"
            />
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box bg="gray.200" w="full">
            <Heading size="md">Maiores compradores</Heading>

            <Stack>
              <Flex p={2} gap={2} alignItems="center">
                <Heading size="lg">1</Heading>
                <Avatar size="sm" />
                <Text>{formatToBrl(1100)}</Text>
              </Flex>
              <Divider />
              <Flex p={2} gap={2} alignItems="center">
                <Heading size="lg">2</Heading>
                <Avatar size="sm" />
                <Text>{formatToBrl(1100)}</Text>
              </Flex>
              <Divider />
              <Flex p={2} gap={2} alignItems="center">
                <Heading size="lg">3</Heading>
                <Avatar size="sm" />
                <Text>{formatToBrl(1100)}</Text>
              </Flex>
              <Divider />
              <Flex p={2} gap={2} alignItems="center">
                <Heading size="lg">4</Heading>
                <Avatar size="sm" />
                <Text>{formatToBrl(1100)}</Text>
              </Flex>
              <Divider />
              <Flex p={2} gap={2} alignItems="center">
                <Heading size="lg">5</Heading>
                <Avatar size="sm" />
                <Text>{formatToBrl(1100)}</Text>
              </Flex>
            </Stack>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box bg="gray.200" w="full">
            <Heading size="md">Percentual de lucro</Heading>
            <ReactApexChart
              options={{
                chart: {
                  width: 380,
                  type: "pie",
                },
                legend: { show: false },
              }}
              series={[60, 40]}
              type="pie"
            />
          </Box>
        </GridItem>

        <GridItem colSpan={4}>
          <Box bg="gray.200" w="full">
            <Heading size="md">Produtos mais vendidos</Heading>
            <Table>
              <Thead>
                <Th>#</Th>
                <Th>Produto</Th>
                <Th>Unidades vendidas</Th>
                <Th>Lucro</Th>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>1</Td>
                  <Td>Perfume 02</Td>
                  <Td>14 un.</Td>
                  <Td>{formatToBrl(230)}</Td>
                </Tr>
                <Tr>
                  <Td>1</Td>
                  <Td>Perfume 02</Td>
                  <Td>14 un.</Td>
                  <Td>{formatToBrl(230)}</Td>
                </Tr>
                <Tr>
                  <Td>1</Td>
                  <Td>Perfume 02</Td>
                  <Td>14 un.</Td>
                  <Td>{formatToBrl(230)}</Td>
                </Tr>
                <Tr>
                  <Td>1</Td>
                  <Td>Perfume 02</Td>
                  <Td>14 un.</Td>
                  <Td>{formatToBrl(230)}</Td>
                </Tr>
                <Tr>
                  <Td>1</Td>
                  <Td>Perfume 02</Td>
                  <Td>14 un.</Td>
                  <Td>{formatToBrl(230)}</Td>
                </Tr>
                <Tr>
                  <Td>1</Td>
                  <Td>Perfume 02</Td>
                  <Td>14 un.</Td>
                  <Td>{formatToBrl(230)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </GridItem>
        <GridItem colSpan={4}>
          <Box bg="gray.200" w="full">
            <Heading size="md">Vendas por categoria</Heading>
            <ReactApexChart
              options={{
                chart: {
                  type: "bar",
                  height: 350,
                  toolbar: { show: false },
                },
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                    horizontal: true,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                xaxis: {
                  categories: [
                    "Perfumes",
                    "Hidratates",
                    "Cabelos",
                    "Protetor Solar",
                    "Cremes antisinais",
                    "Maquiagem",
                    "Corpo e banho",
                    "Rosto",
                    "Infantil",
                  ],
                },
              }}
              series={[
                {
                  data: [400, 430, 448, 470, 580, 690, 1100, 1200, 1380],
                },
              ]}
              type="bar"
              height={350}
            />
          </Box>
        </GridItem>
      </Grid>
    </Layout>
  );
}
