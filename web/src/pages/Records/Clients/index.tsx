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
  Avatar,
} from "@chakra-ui/react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { NewClient } from "../../../shared/clients/NewClient";
// import { ViewClient } from "../../../shared/clients/ViewClient";

type Client = {
  id: number;
  name: string;
  birthday: number;
  avatar: string;
};

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientDialog, setNewClientDialog] = useState(false);
  //const [viewClientDialog, setViewClientDialog] = useState<null | number>(null);

  const fetchClients = useCallback(() => {
    api.get("clients").then((res) => {
      setClients(res.data);
    });
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <>
      {newClientDialog && (
        <NewClient
          open={newClientDialog}
          onClose={() => setNewClientDialog(false)}
          afterSubmit={fetchClients}
        />
      )}

      {/* {viewClientDialog && (
        <ViewClient
          open={!!viewClientDialog}
          onClose={() => setViewClientDialog(null)}
          clientId={viewClientDialog}
        />
      )} */}

      <div>
        <Box display="flex" justifyContent="space-between">
          <InputGroup>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input placeholder="Buscar cliente" width="auto" />
          </InputGroup>
          <Button
            colorScheme="purple"
            onClick={() => setNewClientDialog(true)}
            leftIcon={<FiPlus />}
          >
            Novo cliente
          </Button>
        </Box>

        <SimpleGrid columns={8} spacing={4} mt={4}>
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
              // onClick={() => setViewClientDialog(client.id)}
            >
              <Avatar size="lg" src={client.avatar} />

              <Heading size="sm" noOfLines={2} mt={2}>
                {client.name}
              </Heading>
            </Box>
          ))}
        </SimpleGrid>
      </div>
    </>
  );
}
