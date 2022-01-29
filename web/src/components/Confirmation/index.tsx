import * as React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

export interface ConfirmationOptions {
  catchOnCancel?: boolean;
  title: string;
  description: string | React.ReactElement;
  primaryActionText?: string;
  secondaryActionText?: string;
}

interface ConfirmationDialogProps extends ConfirmationOptions {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const {
    open,
    title,
    description,
    onSubmit,
    onClose,
    primaryActionText,
    secondaryActionText,
  } = props;
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={open}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {secondaryActionText || "Cancelar"}
            </Button>
            <Button colorScheme="red" onClick={onSubmit} ml={3}>
              {primaryActionText || "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
