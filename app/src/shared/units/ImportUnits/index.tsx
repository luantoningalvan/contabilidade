import React from "react";
import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Modal } from "../../../components/Modal";
import { useDropzone } from "react-dropzone";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import { fileToBase64 } from "../../../utils/fileToBase64";
import { api } from "../../../services/api";
import { Controller, useForm } from "react-hook-form";
import { MonthSelector } from "../../../components/MothSelector";
import { NewProduct } from "../../products/NewProduct";

interface ImportUnitsProps {
  open: boolean;
  onClose: () => void;
  afterSubmit: () => void;
}

interface ImportedUnit {
  id: number;
  alreadyExists: boolean;
  name: string;
  quantity: number;
  total_price: number;
  individual_price: number;
  natCode: string;
}

export function ImportUnits(props: ImportUnitsProps) {
  const { onClose, open } = props;
  const [step, setStep] = React.useState(1);
  const [list, setList] = React.useState<ImportedUnit[]>([]);
  const [newProduct, setNewProduct] = React.useState<{
    natCode: string;
  } | null>(null);
  const { register, control } = useForm({
    defaultValues: {
      products: [
        {
          product: undefined,
          quantity: undefined,
          price: undefined,
          expiration_date: undefined,
        },
      ],
    },
  });

  const onDrop = React.useCallback(async (acceptedFiles) => {
    try {
      const getBase64 = (await fileToBase64(acceptedFiles[0])) as string;
      console.log(getBase64);
      const data = {
        file: getBase64.split("base64,")[1],
      };
      const result = await api.post("/importer", data);
      setList(result.data);
      setStep(2);
    } catch (error) {
      alert("ERRO");
    }
  }, []);

  const handleRemoveProduct = React.useCallback(
    (natCode: string) => {
      setList((list) => list.filter((item) => item.natCode !== natCode));
    },
    [setList]
  );

  const handleAfterAddProduct = React.useCallback((data: any) => {
    console.log(data);
    setList((list) =>
      list.map((item) =>
        item.natCode === data.natCode
          ? {
              ...item,
              alreadyExists: true,
              id: data.id,
              name: data.name,
            }
          : item
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop,
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragOver: () => {},
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Importar unidades"
      size={step === 1 ? "xl" : "4xl"}
    >
      <>
        {!!newProduct && (
          <NewProduct
            open={!!newProduct}
            onClose={() => setNewProduct(null)}
            afterSubmit={(data) => handleAfterAddProduct(data)}
            initialValues={newProduct}
          />
        )}

        {step === 1 && (
          <Box
            w="full"
            h={180}
            rounded={4}
            overflow="hidden"
            mb={8}
            {...getRootProps()}
          >
            <input {...(getInputProps() as any)} />

            <Box
              borderStyle="dashed"
              borderWidth={2}
              p={2}
              flexDir="column"
              cursor="pointer"
              display="flex"
              justifyContent="center"
              alignItems="center"
              h={180}
            >
              <FiUpload size={32} />
              <Text lineHeight="120%" fontSize="sm" textAlign="center" mt={2}>
                Arraste o arquivo aqui ou clique para enviar
              </Text>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <>
            <Table size="sm">
              <Thead>
                <Th ps={2} pe={2}></Th>
                <Th ps={2} pe={2}>
                  Produto
                </Th>
                <Th ps={2} pe={2}>
                  Qnt.
                </Th>
                <Th ps={2} pe={2}>
                  Valor
                </Th>
                <Th ps={2} pe={2}>
                  Vencimento
                </Th>
                <Th ps={2} pe={2}></Th>
              </Thead>
              <Tbody>
                {list
                  .filter(({ alreadyExists }) => alreadyExists)
                  .map((field) => (
                    <Tr key={field.id}>
                      <Td width="48px" ps={2} pe={2}>
                        <IconButton
                          aria-label="Remover"
                          onClick={() => handleRemoveProduct(field.natCode)}
                        >
                          <FiX />
                        </IconButton>
                      </Td>
                      <Td ps={2} pe={2}>
                        <Text>{field.name}</Text>
                      </Td>
                      <Td width="90px" ps={2} pe={2}>
                        <Input
                          type="number"
                          placeholder="Qnt."
                          defaultValue={field.quantity}
                          {...register(`products.${field.id}.quantity`, {
                            valueAsNumber: true,
                            required: true,
                          })}
                          required
                        />
                      </Td>
                      <Td width="140px" ps={2} pe={2}>
                        <Input
                          fullWidth
                          placeholder="Valor"
                          type="number"
                          min="0"
                          step="any"
                          defaultValue={field.individual_price}
                          {...register(`products.${field.id}.price`, {
                            valueAsNumber: true,
                            required: true,
                          })}
                        />
                      </Td>
                      <Td width="160px" ps={2} pe={2}>
                        <Controller
                          name={`products.${field.id}.expiration_date`}
                          control={control}
                          render={({ field }) => (
                            <MonthSelector
                              onChange={field.onChange}
                              value={field.value}
                            />
                          )}
                        />
                      </Td>
                      <Td width="48px" ps={2} pe={2}>
                        <IconButton aria-label="Incluir" colorScheme="purple">
                          <FiPlus />
                        </IconButton>
                      </Td>
                    </Tr>
                  ))}
                <Tr>
                  <Td colSpan={6}>
                    <Heading size="sm" mt={4} mb={2}>
                      Produtos não cadastrados
                    </Heading>
                  </Td>
                </Tr>
                {list
                  .filter(({ alreadyExists }) => !alreadyExists)
                  .map((field, index) => (
                    <Tr key={field.natCode}>
                      <Td width="48px" ps={2} pe={2}>
                        <IconButton
                          aria-label="Remover"
                          onClick={() => handleRemoveProduct(field.natCode)}
                        >
                          <FiX />
                        </IconButton>
                      </Td>
                      <Td ps={2} pe={2}>
                        <Text>{field.name}</Text>
                      </Td>
                      <Td width="90px" ps={2} pe={2}>
                        <Text>{field.quantity}</Text>
                      </Td>
                      <Td width="140px" ps={2} pe={2}>
                        <Text>{field.individual_price}</Text>
                      </Td>
                      <Td width="48px" ps={2} pe={2} colSpan={2} isNumeric>
                        <Button
                          variant="outline"
                          aria-label="Incluir"
                          colorScheme="purple"
                          onClick={() =>
                            setNewProduct({ natCode: field.natCode })
                          }
                        >
                          Adicionar produto
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </>
        )}
      </>
    </Modal>
  );
}
