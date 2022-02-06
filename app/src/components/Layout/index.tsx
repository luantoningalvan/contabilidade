import { Link } from "react-router-dom";
import { FiUsers, FiBarChart, FiBox } from "react-icons/fi";
import { Box, Tooltip } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
}

const links = [
  { url: "/", label: "Visão geral", icon: FiBarChart },
  { url: "/unidades", label: "Unidades", icon: FiBox },
  { url: "/cadastros", label: "Cadastros", icon: FiUsers },
];

export const Layout = (props: LayoutProps) => {
  return (
    <>
      <Box
        w={["100vw", "56px"]}
        h={["56px", "100vh"]}
        display="flex"
        borderRightWidth={1}
        flexDirection={["row", "column"]}
        align="center"
        pos="fixed"
        top={[undefined, 0]}
        bottom={[0, undefined]}
        left={0}
        bg="white"
        zIndex={100}
        borderTopWidth={[1, 0]}
      >
        <Box
          w="56px"
          h="56px"
          display={["none", "flex"]}
          alignItems="center"
          justifyContent="center"
          fontSize="1.3rem"
          lineHeight="1.3rem"
          borderBottomWidth={1}
        >
          <Link to="/">
            <img src="./logo.svg" alt="Logo Natura" />
          </Link>
        </Box>

        <Box
          as="nav"
          display="flex"
          flexDirection={["row", "column"]}
          height="56px"
          alignItems="center"
          gap={1}
          mt={[0, 2]}
          flex={[1, "none"]}
        >
          {links.map((link) => (
            <Tooltip
              key={link.url}
              fontSize="md"
              label={link.label}
              placement="right"
            >
              <Box
                textDecor="none"
                rounded={4}
                flex={[1, "none"]}
                color="gray.700"
                to={link.url}
                as={Link}
                p={2}
                _hover={{ bg: "gray.100" }}
              >
                <link.icon size={22} />
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Box>
      <Box as="main" ml={[0, "56px"]}>
        {props.children}
      </Box>
    </>
  );
};
