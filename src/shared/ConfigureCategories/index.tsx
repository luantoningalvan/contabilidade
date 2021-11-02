import * as React from "react";
import { Modal } from "../../components/Modal";

interface ConfigureCategoriesProps {
  open: boolean;
  onClose: () => void;
}

export function ConfigureCategories({
  onClose,
  open,
}: ConfigureCategoriesProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      title="Configurar categorias"
      footer={{
        primary: {
          text: "Ok",
          onClick: onClose,
        },
      }}
    >
      <div>aaa</div>
    </Modal>
  );
}
