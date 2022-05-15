import { Box, chakra } from "@chakra-ui/react";
import { FaFileImport } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

interface FloatButtonProps {
  bg: string;
  onAdd: () => void;
  onImport: () => void;
}

export function FloatButton(props: FloatButtonProps) {
  const { bg, onAdd, onImport } = props;

  return (
    <Box
      pos="fixed"
      right="24px"
      bottom="24px"
      display="flex"
      alignItems="center"
      gap={4}
      _hover={{
        "#import-button": {
          display: "flex",
        },
      }}
    >
      <chakra.button
        size="lg"
        aria-label="Incluir unidade"
        bg={bg}
        h="48px"
        w="48px"
        display="none"
        shadow="md"
        zIndex={100}
        justifyContent="center"
        alignItems="center"
        rounded="50%"
        onClick={onImport}
        id="import-button"
      >
        <FaFileImport size={20} color="white" />
      </chakra.button>
      <chakra.button
        size="lg"
        aria-label="Incluir unidade"
        bg={bg}
        h="56px"
        w="56px"
        display="flex"
        shadow="md"
        zIndex={100}
        justifyContent="center"
        alignItems="center"
        rounded="50%"
        onClick={onAdd}
      >
        <FiPlus size={32} color="white" />
      </chakra.button>
    </Box>
  );
}
