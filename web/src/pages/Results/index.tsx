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
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { FiArrowDown, FiArrowUp, FiDollarSign, FiUsers } from "react-icons/fi";
import { IconBaseProps } from "react-icons";
import { Layout } from "../../components/Layout";
import { formatToBrl } from "../../utils/formatToBrl";
import { api } from "../../services/api";

interface InfoCardProps {
  title: string;
  value: string;
  icon: React.FC<IconBaseProps>;
  iconColor: string;
  iconBg: string;
}

const InfoCard = (props: InfoCardProps) => (
  <Box
    p={4}
    py={6}
    borderWidth={1}
    rounded={4}
    display="flex"
    w="full"
    justifyContent="space-between"
    alignItems="center"
  >
    <Box>
      <Text fontSize="md" color="gray.600">
        {props.title}
      </Text>
      <Heading size="lg" color="gray.900">
        {props.value}
      </Heading>
    </Box>
    <Box color={props.iconColor} bg={props.iconBg} p={2} rounded="full">
      <props.icon size={40} />
    </Box>
  </Box>
);

export function Results() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <Layout>
      <Grid p={8} gap={4} templateColumns="repeat(8, 1fr)">
        <GridItem colSpan={2}>
          <InfoCard
            title="Total em vendas"
            value={formatToBrl(data?.totalSales)}
            icon={FiArrowUp}
            iconBg="green.100"
            iconColor="green.400"
          />
        </GridItem>
        <GridItem colSpan={2}>
          <InfoCard
            title="Lucro"
            value={formatToBrl(data?.totalProfit)}
            icon={FiDollarSign}
            iconBg="yellow.100"
            iconColor="yellow.500"
          />
        </GridItem>
        <GridItem colSpan={2}>
          <InfoCard
            title="Total a receber"
            value={formatToBrl(data?.totalReceivable)}
            icon={FiArrowDown}
            iconBg="blue.100"
            iconColor="blue.400"
          />
        </GridItem>
        <GridItem colSpan={2}>
          <InfoCard
            title="Total de clientes"
            value={data?.totalClients}
            icon={FiUsers}
            iconBg="red.100"
            iconColor="red.400"
          />
        </GridItem>
        <GridItem colSpan={4}>
          <Box w="full" borderWidth={1} rounded={4} h={350}>
            <Heading size="md" color="gray.700" p={4}>
              Total de vendas por mês
            </Heading>
            <ReactApexChart
              height={270}
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
          <Box w="full" borderWidth={1} rounded={4} h={350}>
            <Heading size="md" color="gray.700" p={4}>
              Maiores compradores
            </Heading>
            <Stack mb={4} mt={2} spacing={3}>
              {Array(5)
                .fill(1)
                .map((_, i) => (
                  <>
                    <Flex px={4} alignItems="center">
                      <Heading size="md">{i + 1}</Heading>
                      <Avatar size="sm" ml={4} mr={6} />
                      <Text fontSize="lg">{formatToBrl(1100)}</Text>
                    </Flex>
                    {i < 4 && <Divider />}
                  </>
                ))}
            </Stack>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box w="full" borderWidth={1} rounded={4} h={350}>
            <Heading size="md" color="gray.700" p={4}>
              Percentual de lucro
            </Heading>
            <ReactApexChart
              height={300}
              options={{
                chart: {
                  type: "pie",
                },
                legend: { show: false },
                stroke: {
                  show: false,
                },
                labels: ["Vendas", "Lucro"],
              }}
              series={[40, 60]}
              type="pie"
            />
          </Box>
        </GridItem>

        <GridItem colSpan={4}>
          <Box w="full" borderWidth={1} rounded={4}>
            <Heading size="md" color="gray.700" p={4}>
              Produtos mais vendidos
            </Heading>
            <Table size="sm">
              <Thead>
                <Th>#</Th>
                <Th>Produto</Th>
                <Th>Unidades vendidas</Th>
                <Th>Lucro</Th>
              </Thead>
              <Tbody>
                {Array(5)
                  .fill(1)
                  .map((_, i) => (
                    <Tr>
                      <Td w={10}>
                        <Heading size="md">{i + 1}</Heading>
                      </Td>
                      <Td display="flex" alignItems="center">
                        <Image
                          h="48px"
                          w="48px"
                          src="http://localhost:3333/public/thumb-76420.jpg"
                        />
                        Produto {i + 1}
                      </Td>
                      <Td>{i + 10} un.</Td>
                      <Td>{formatToBrl((i + 1) * 100)}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </GridItem>
        <GridItem colSpan={4}>
          <Box w="full" borderWidth={1} rounded={4}>
            <Heading size="md" color="gray.700" px={4} pt={4}>
              Vendas por categoria
            </Heading>
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
                    barHeight: "50px",
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
                  labels: { show: false },
                },
              }}
              series={[
                {
                  name: "Vendas",
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
