import React from "react";
import {
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
};
interface TableProps {
  columns: Column[];
  data: any[];
  contextActions?: (row: any) => Action[];
}

export const Table = (props: TableProps) => {
  return (
    <ChakraTable variant="striped" size="sm">
      <Thead>
        <Tr>
          {props.columns.map((col) => (
            <Th
              variant="head"
              key={col.name}
              width={col.width}
              textAlign={col.align}
            >
              {col.label}
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
