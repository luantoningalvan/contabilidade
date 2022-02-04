import React, { useCallback, useState } from "react";
import {
  Box,
  MenuItem,
  MenuList,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ContextMenu } from "chakra-ui-contextmenu";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type Action = {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  hide?: boolean;
};

type Column = {
  label: string;
  name: string;
  align?: "inherit" | "left" | "right" | "center" | "justify";
  width?: number | string;
  format?: (value: any, row: any) => React.ReactElement | string;
  orderable?: boolean;
};
interface TableProps {
  columns: Column[];
  data: any[];
  contextActions?: (row: any) => Action[];
  onOrderChange?: (order: string[]) => void;
}

export const Table = (props: TableProps) => {
  const [currentOrder, setCurrentOrder] = useState<null | string[]>();

  const handleChangeOrder = useCallback(
    (col: Column) => {
      let newState;

      if (currentOrder && currentOrder[0] === col.name) {
        newState = [col.name, currentOrder[1] === "asc" ? "desc" : "asc"];
      } else {
        newState = [col.name, "asc"];
      }

      setCurrentOrder(newState);
      !!props.onOrderChange && props.onOrderChange(newState);
    },
    [currentOrder, props]
  );

  return (
    <ChakraTable variant="striped" size="sm">
      <Thead>
        <Tr>
          {props.columns.map((col) => (
            <Th
              variant="head"
              key={col.name}
              width={col.width}
              cursor={col.orderable ? "pointer" : "default"}
              onClick={() => col.orderable && handleChangeOrder(col)}
              userSelect="none"
              _hover={{ "& .order-button": { opacity: 1 } }}
            >
              <Box
                display="flex"
                flexDir={col.align === "right" ? "row-reverse" : "row"}
                alignItems="center"
                justifyContent={col.align}
                gap={2}
              >
                {col.label}
                {col.orderable && (
                  <Box
                    width={18}
                    opacity={currentOrder?.[0] === col.name ? 1 : 0}
                    className="order-button"
                  >
                    {currentOrder?.[0] === col.name ? (
                      currentOrder[1] === "desc" ? (
                        <FiChevronDown size={16} />
                      ) : (
                        <FiChevronUp size={16} />
                      )
                    ) : (
                      <FiChevronUp color="#bbb" size={16} />
                    )}
                  </Box>
                )}
              </Box>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {props.contextActions
          ? props.data.map((row) => (
              <ContextMenu<HTMLDivElement>
                renderMenu={() => (
                  <MenuList>
                    {props.contextActions &&
                      props.contextActions(row).map(
                        (act) =>
                          !act.hide && (
                            <MenuItem onClick={act.onClick} icon={act.icon}>
                              {act.label}
                            </MenuItem>
                          )
                      )}
                  </MenuList>
                )}
              >
                {(ref) => (
                  <Tr key={`col-${row.id}`} ref={ref}>
                    {props.columns.map((col) => (
                      <Td
                        textAlign={col.align}
                        key={`col-${row.id}-${col.name}`}
                      >
                        {col.format
                          ? col.format(row[col.name], row)
                          : row[col.name]}
                      </Td>
                    ))}
                  </Tr>
                )}
              </ContextMenu>
            ))
          : props.data.map((row) => (
              <Tr key={`col-${row.id}`}>
                {props.columns.map((col) => (
                  <Td textAlign={col.align} key={`col-${row.id}-${col.name}`}>
                    {col.format
                      ? col.format(row[col.name], row)
                      : row[col.name]}
                  </Td>
                ))}
              </Tr>
            ))}
      </Tbody>
    </ChakraTable>
  );
};
