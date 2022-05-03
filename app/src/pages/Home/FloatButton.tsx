import { chakra } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

interface FloatButtonProps {
  bg: string;
  onClick: () => void;
}

export function FloatButton(props: FloatButtonProps) {
  const { bg, onClick } = props;

  return (
    <chakra.button
      size="lg"
      aria-label="Incluir unidade"
      pos="fixed"
      bg={bg}
      right="24px"
      bottom="24px"
      h="56px"
      w="56px"
      display="flex"
      shadow="md"
      zIndex={100}
      justifyContent="center"
      alignItems="center"
      rounded="50%"
      onClick={onClick}
    >
      <FiPlus size={32} color="white" />
    </chakra.button>
  );
}
