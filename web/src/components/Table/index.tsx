import React, { useCallback, useState } from "react";
import {
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

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
}

export const Table = (props: TableProps) => {
  return (
    <ChakraTable stickyHeader variant="striped" size="sm">
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
        {props.data.map((row) => (
          <Tr key={`col-${row.id}`} hover>
            {props.columns.map((col) => (
              <Td textAlign={col.align} key={`col-${row.id}-${col.name}`}>
                {col.format ? col.format(row[col.name], row) : row[col.name]}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </ChakraTable>
  );
};
