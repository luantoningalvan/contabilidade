import * as React from "react";
import {
  Button,
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Box,
  CircularProgress,
} from "@chakra-ui/react";

interface ModalProps extends Omit<ChakraModalProps, "isOpen"> {
  title?: string;
  onClose: () => void;
  open?: boolean;
  loading?: boolean;
  children: React.ReactElement;
  footer?: {
    primary: {
      text: string;
      onClick: () => void;
    };
    secondary?: {
      text: string;
      onClick: () => void;
    };
    aditionalAction?: React.ReactElement;
  };
}

export function Modal(props: ModalProps) {
  const { title, children, footer, open, onClose, loading, ...rest } = props;

  return (
    <ChakraModal isOpen={open} onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent>
        {loading ? (
          <Box
            h={300}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress isIndeterminate />
          </Box>
        ) : (
          <>
            {!!title && <ModalHeader>{title}</ModalHeader>}
            <ModalCloseButton />
            <ModalBody>{children}</ModalBody>

            {footer && (
              <ModalFooter gap={2}>
                {footer?.aditionalAction && (
                  <div style={{ flex: 1 }}>{footer?.aditionalAction}</div>
                )}
                {footer?.secondary && (
                  <Button variant="ghost" onClick={footer?.secondary.onClick}>
                    {footer.secondary.text}
                  </Button>
                )}
                <Button colorScheme="purple" onClick={footer?.primary.onClick}>
                  {footer?.primary.text}
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </ChakraModal>
  );
}
