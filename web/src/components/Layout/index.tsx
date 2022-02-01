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
        w="56px"
        h="100vh"
        display="flex"
        borderRightWidth={1}
        flexDirection="column"
        align="center"
        pos="fixed"
        top={0}
        left={0}
      >
        <Box
          w="56px"
          h="56px"
          display="flex"
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
          flexDirection="column"
          height="3rem"
          alignItems="center"
          gap={1}
          mt={2}
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
      <Box as="main" ml="56px">
        {props.children}
      </Box>
    </>
  );
};
