import * as React from "react";
import { Modal } from "../../../components/Modal";
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Stack,
  Avatar,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { api } from "../../../services/api";
import { FiArrowDown, FiArrowUp, FiEdit, FiPlus } from "react-icons/fi";
import { BiCake, BiWallet } from "react-icons/bi";

import { formatToBrl } from "../../../utils/formatToBrl";
import { NewPayment } from "../../transactions/NewPayment";

interface TransactionCardProps {
  value: string;
  description: string;
  type: "income" | "expense";
  date: Date;
}

function TransactionCard(props: TransactionCardProps) {
  return (
    <Box display="flex" alignItems="center" gap={4}>
      <Box
        rounded="full"
        w={10}
        h={10}
        display="flex"
        alignItems="center"
        flexShrink={0}
        flexGrow={0}
        justifyContent="center"
        bg={props.type === "income" ? "green.100" : "red.100"}
        color={props.type === "income" ? "green.400" : "red.400"}
      >
        {props.type === "expense" ? (
          <FiArrowDown size={22} />
        ) : (
          <FiArrowUp size={22} />
        )}
      </Box>
      <Box>
        <Heading size="sm" mb={1}>
          {props.description}
        </Heading>
        <Text color="gray.500">{formatToBrl(props.value)}</Text>
      </Box>

      <Tooltip
        label={new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
          new Date(props.date)
        )}
      >
        <Text whiteSpace="nowrap" flex={1} textAlign="right" color="gray.500">
          {new Intl.DateTimeFormat("pt-BR", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })
            .format(new Date(props.date))
            .toUpperCase()}
        </Text>
      </Tooltip>
    </Box>
  );
}

interface ViewClientProps {
  open: boolean;
  onClose: () => void;
  clientId: number;
}

export function ViewClient(props: ViewClientProps) {
  const { onClose, open, clientId } = props;
  const [clientData, setClientData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [newPayment, setNewPayment] = React.useState(false);

  const fetchClient = React.useCallback(async () => {
    setLoading(true);
    const result = await api.get(`clients/${clientId}`);
    setClientData(result.data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchClient();
  }, []);

  return (
    <>
      <Modal
        open={open}
        loading={loading}
        size="2xl"
        onClose={onClose}
        title={clientData?.name}
      >
        <Grid gridTemplateColumns="2fr 4fr" gap={12}>
          <GridItem>
            <Stack spacing={4} alignItems="center">
              <Avatar size="xl" src={clientData?.avatar} />

              {clientData?.birthday && (
                <Box display="flex" my={4} alignItems="center">
                  <BiCake size={22} />
                  <Text ml={2}>
                    {new Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                    }).format(new Date(clientData?.birthday))}
                  </Text>
                </Box>
              )}

              <Box>
                <Button leftIcon={<FiEdit />} colorScheme="blue" isFullWidth>
                  Editar
                </Button>
                <Button colorScheme="red" variant="ghost" isFullWidth mt={2}>
                  Excluir
                </Button>
              </Box>
            </Stack>
          </GridItem>
          <GridItem>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading size="md">Histórico financeiro</Heading>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => setNewPayment(true)}
                leftIcon={<FiPlus />}
              >
                Pagamento
              </Button>
            </Box>
            <Box
              mt={6}
              p={4}
              py={2}
              borderWidth={1}
              rounded={4}
              display="flex"
              w="full"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Text fontSize="md" color="gray.600">
                  Saldo da conta
                </Text>
                <Heading size="lg" color="gray.900">
                  {formatToBrl(clientData?.debts)}
                </Heading>
              </Box>
              <Box
                color={clientData?.debts < 0 ? "red.500" : "green.500"}
                bg={clientData?.debts < 0 ? "red.100" : "green.100"}
                p={2}
                rounded="full"
              >
                <BiWallet size={40} />
              </Box>
            </Box>
            <Stack spacing={3} my={6}>
              {clientData?.transactions.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Text color="gray.500" fontSize="lg">
                    Nenhum registro
                  </Text>
                </Box>
              ) : (
                clientData?.transactions?.map((transaction) => (
                  <TransactionCard
                    type={transaction.type === 1 ? "income" : "expense"}
                    value={transaction.value}
                    description={transaction.description}
                    date={transaction.created_at}
                  />
                ))
              )}
            </Stack>
          </GridItem>
        </Grid>
      </Modal>

      {newPayment && (
        <NewPayment
          open={newPayment}
          onClose={() => setNewPayment(false)}
          clientId={clientId}
          afterSubmit={fetchClient}
        />
      )}
    </>
  );
}
