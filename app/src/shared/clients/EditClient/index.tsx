import * as React from "react";
import { Modal } from "../../../components/Modal";
import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { api } from "../../../services/api";
import { FiUpload } from "react-icons/fi";
import { fileToBase64 } from "../../../utils/fileToBase64";

interface EditClientDialogProps {
  open: boolean;
  onClose: () => void;
  afterSubmit?: (data: any) => void;
  clientId: number;
}

export function EditClient(props: EditClientDialogProps) {
  const { onClose, open, clientId, afterSubmit } = props;

  const [avatar, setAvatar] = React.useState<null | string>(null);
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState, setValue } = useForm();
  const toast = useToast();
  const uploadRef = React.useRef<any>();

  const onSubmit = async (data: any) => {
    try {
      const avatarBase64 = uploadRef?.current.files[0]
        ? await fileToBase64(uploadRef?.current.files[0])
        : undefined;

      const result = await api.put(`clients/${clientId}`, {
        name: data.name,
        birthday: data.birthday,
        avatar: avatarBase64,
      });

      !!afterSubmit && afterSubmit(result.data);

      toast({ status: "success", title: "Cliente atualizado" });

      onClose();
    } catch (error) {
      toast({ status: "error", title: error.response.data.message });
    }
  };

  const fetchClient = React.useCallback(async () => {
    setLoading(true);
    const res = await api.get(`clients/${clientId}`);
    const { birthday, name, avatar } = res.data;
    birthday && setValue("birthday", birthday.substring(0, 10));
    name && setValue("name", name);
    avatar && setAvatar(avatar);
    setLoading(false);
  }, [clientId, setValue]);

  React.useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return (
    <Modal
      open={open}
      loading={loading}
      onClose={onClose}
      title="Editar cliente"
      footer={{
        primary: {
          text: "Editar",
          onClick: handleSubmit(onSubmit),
        },
        secondary: { text: "Cancelar", onClick: onClose },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Stack spacing={4}>
          <FormControl>
            <Box
              w={124}
              h={124}
              margin="auto"
              rounded={4}
              borderStyle="dotted"
              borderWidth={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="gray.500"
              cursor="pointer"
              onClick={() => uploadRef?.current && uploadRef?.current.click()}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar do cliente" />
              ) : (
                <FiUpload size={32} />
              )}
            </Box>
            <input
              name="avatar"
              style={{ display: "none" }}
              ref={uploadRef}
              onChange={(e) => {
                if (e.target.files) {
                  const imageUrl = URL.createObjectURL(e.target.files[0]);
                  setAvatar(imageUrl);
                } else {
                  setAvatar(null);
                }
              }}
              type="file"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="name-field">Nome</FormLabel>

            <Input
              id="name-field"
              placeholder="Nome do cliente"
              isInvalid={formState.errors.name}
              {...register("name", { required: true })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="birthday-field">Nascimento</FormLabel>

            <Input
              placeholder="Nascimento"
              isInvalid={formState.errors.birthday}
              type="date"
              id="birthday"
              {...register("birthday")}
            />
          </FormControl>
        </Stack>
      </form>
    </Modal>
  );
}
