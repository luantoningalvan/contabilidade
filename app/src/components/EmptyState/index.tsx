import { Box, Text, Heading, Button } from "@chakra-ui/react";
import { FiPlus, FiFolder } from "react-icons/fi";
import { IconType } from "react-icons";

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
  action?: {
    text: string;
    onClick(): void;
  };
  [key: string]: any;
}

export function EmptyState(props: EmptyStateProps) {
  const { icon: Icon, title, description, action, ...rest } = props;

  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      boxSizing="border-box"
      textAlign="center"
      h="400"
      p={4}
      {...rest}
    >
      <Icon size={56} />
      <Heading size="md" mt={4} mb={1}>
        {title}
      </Heading>
      <Text fontSize="md" color="gray.600">
        {description}
      </Text>
      {action && (
        <Button
          colorScheme="purple"
          mt={4}
          onClick={action.onClick}
          leftIcon={<FiPlus />}
        >
          {action.text}
        </Button>
      )}
    </Box>
  );
}
