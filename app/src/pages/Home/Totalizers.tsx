import { Box, Text, Heading, Stack } from "@chakra-ui/react";
import { FiArrowDown, FiArrowUp, FiBox } from "react-icons/fi";

import { FiDollarSign } from "react-icons/fi";
import { formatToBrl } from "../../utils/formatToBrl";

interface TotalizersProps {
  isOpen: boolean;
  counts: {
    units: number;
    purchases: number;
    sales: number;
    profit: number;
  };
}

export function Totalizers(props: TotalizersProps) {
  const { isOpen, counts } = props;

  return (
    <Box
      borderLeftWidth={1}
      p={3}
      h="full"
      w="240px"
      pos="fixed"
      right={0}
      transform={isOpen ? "translateX(0px)" : "translateX(240px)"}
      transition="transform 0.3s ease-in-out"
    >
      <Stack spacing={2}>
        <Box borderWidth={1} p={4} rounded={4}>
          <Box display="flex" gap={2} color="gray.500">
            <Text>Quantidade</Text>
            <FiBox size={20} />
          </Box>
          <Heading size="lg" color="gray.700">
            {counts.units} un.
          </Heading>
        </Box>
        <Box borderWidth={1} p={4} rounded={4}>
          <Box display="flex" gap={2} color="gray.500">
            <Text>Compras</Text>
            <FiArrowDown size={20} />
          </Box>
          <Heading size="lg" color="gray.700">
            {formatToBrl(counts.purchases)}
          </Heading>
        </Box>
        <Box borderWidth={1} p={4} rounded={4}>
          <Box display="flex" color="gray.500" gap={2}>
            <Text>Vendas</Text>
            <FiArrowUp size={20} />
          </Box>
          <Heading size="lg" color="gray.700">
            {formatToBrl(counts.sales)}
          </Heading>
        </Box>
        <Box borderWidth={1} p={4} rounded={4}>
          <Box display="flex" gap={2} color="gray.500">
            <Text>Lucro</Text>
            <FiDollarSign size={20} />
          </Box>
          <Heading size="lg" color="gray.700">
            {formatToBrl(counts.profit)}
          </Heading>
        </Box>
      </Stack>
    </Box>
  );
}
