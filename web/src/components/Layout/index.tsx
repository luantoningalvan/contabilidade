import { Link } from "react-router-dom";
import { FiUsers, FiBarChart, FiBox } from "react-icons/fi";
import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
}

const links = [
  { url: "/", icon: FiBox },
  { url: "/results", icon: FiBarChart },
  { url: "/records", icon: FiUsers },
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
            <Box
              textDecor="none"
              rounded={4}
              color="gray.700"
              key={link.url}
              to={link.url}
              as={Link}
              p={2}
              _hover={{ bg: "gray.100" }}
            >
              <link.icon size={22} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box as="main" ml="56px">
        {props.children}
      </Box>
    </>
  );
};
