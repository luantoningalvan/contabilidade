import { useCallback, useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  Input,
  InputLeftElement,
  InputGroup,
  Avatar,
} from "@chakra-ui/react";
import { FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { NewClient } from "../../../shared/clients/NewClient";
import { ViewClient } from "../../../shared/clients/ViewClient";
import { EmptyState } from "../../../components/EmptyState";
import { parseOptions } from "../../../utils/parseOptions";
import { debounce } from "../../../utils/debounce";

type Client = {
  id: number;
  name: string;
  birthday: number;
  avatar: string;
};

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientDialog, setNewClientDialog] = useState(false);
  const [viewClientDialog, setViewClientDialog] = useState<null | number>(null);
  const [filters, setFilters] = useState({});

  const fetchClients = useCallback(() => {
    const options = parseOptions(filters);

    api.get(`clients?${options}`).then((res) => {
      setClients(res.data);
    });
  }, [filters]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearch = debounce((txt: string) => {
    setFilters((curr) => ({ ...curr, search: txt }));
  });

  return (
    <>
      {newClientDialog && (
        <NewClient
          open={newClientDialog}
          onClose={() => setNewClientDialog(false)}
          afterSubmit={fetchClients}
        />
      )}

      {viewClientDialog && (
        <ViewClient
          open={!!viewClientDialog}
          onClose={() => setViewClientDialog(null)}
          clientId={viewClientDialog}
        />
      )}

      <div>
        <>
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
                placeholder="Buscar cliente"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
            <Button
              colorScheme="purple"
              onClick={() => setNewClientDialog(true)}
              minW="auto"
              leftIcon={<FiPlus />}
            >
              Novo cliente
            </Button>
          </Box>
          {clients.length > 0 ? (
            <SimpleGrid columns={[2, 3, 4, 6, 6, 8]} spacing={4} mt={4}>
              {clients.map((client) => (
                <Box
                  key={client.id}
                  display="flex"
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                  borderWidth={1}
                  p={4}
                  rounded={6}
                  cursor="pointer"
                  onClick={() => setViewClientDialog(client.id)}
                >
                  <Avatar size="xl" src={client.avatar} />

                  <Heading size="sm" textAlign="center" noOfLines={2} mt={2}>
                    {client.name}
                  </Heading>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <EmptyState
              icon={FiUsers}
              title={
                Object.values(filters).filter((v) => !!v).length > 0
                  ? "Nenhum cliente que corresponda a busca"
                  : "Nenhum cliente encontrado"
              }
              description="É necessário cadastrar seus clientes para poder realizar vendas"
            />
          )}
        </>
      </div>
    </>
  );
}
