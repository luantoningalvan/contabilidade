import React, { useCallback, useEffect } from "react";
import { Box, CircularProgress, Image, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

interface ImageUploadFieldProps {
  value: any;
  onChange: any;
  loading?: boolean;
}

export const ImageUploadField = (props: ImageUploadFieldProps) => {
  const { value, onChange, loading } = props;
  const [preview, setPreview] = React.useState(null);

  useEffect(() => {
    if (!!value) {
      const imagePreview = URL.createObjectURL(value);
      setPreview(imagePreview);
    } else {
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles) => {
    const imagePreview = URL.createObjectURL(acceptedFiles[0]);
    setPreview(imagePreview);
    onChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop,
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragOver: () => {},
  });

  return (
    <Box w={180} h={180} rounded={4} overflow="hidden" {...getRootProps()}>
      <input {...(getInputProps() as any)} />

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="full"
          w="full"
        >
          <CircularProgress isIndeterminate />
        </Box>
      ) : preview ? (
        <Image
          src={preview}
          alt="Preview"
          width={180}
          height={180}
          objectFit="cover"
          cursor="pointer"
        />
      ) : (
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
            Arraste a imagem ou clique para enviar
          </Text>
        </Box>
      )}
    </Box>
  );
};
