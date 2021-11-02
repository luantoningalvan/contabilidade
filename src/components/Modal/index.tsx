import * as React from "react";
import {
  Button,
  Dialog,
  DialogProps,
  Typography,
  IconButton,
} from "@mui/material";
import { ModalHeader, ModalContent, ModalFooter } from "./styles";
import { FiX } from "react-icons/fi";

interface ModalProps extends DialogProps {
  title: string;
  onClose: () => void;
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
  const { title, children, footer, ...rest } = props;

  return (
    <Dialog {...rest}>
      <div style={{ padding: 24 }}>
        <ModalHeader>
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={props.onClose}>
            <FiX />
          </IconButton>
        </ModalHeader>

        <ModalContent>{children}</ModalContent>

        {footer && (
          <ModalFooter>
            {footer.aditionalAction && (
              <div style={{ flex: 1 }}>{footer.aditionalAction}</div>
            )}
            {footer.secondary && (
              <Button size="large" onClick={footer.secondary.onClick}>
                {footer.secondary.text}
              </Button>
            )}
            <Button
              size="large"
              disableElevation
              onClick={footer.primary.onClick}
              variant="contained"
            >
              {footer.primary.text}
            </Button>
          </ModalFooter>
        )}
      </div>
    </Dialog>
  );
}
