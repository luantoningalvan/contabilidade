import * as React from "react";

import { useToast, Tooltip } from "@chakra-ui/react";
import { FiCheckSquare, FiEdit, FiTrash } from "react-icons/fi";
import { api } from "../../services/api";
import { Unit } from "./types";

import { FiDollarSign } from "react-icons/fi";
import { SellUnit } from "../../shared/units/SellUnit";
import { useConfirmation } from "../../hooks/useConfirmation";
import { EditUnit } from "../../shared/units/EditUnit";
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

interface UnitsTableProps {
  fetchUnits: any;
  units: any;
  setFilters: any;
}

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

const tableColumns: Column[] = [
  { label: "Nome", name: "name" },
  {
    label: "Preço Compra",
    name: "purchase_price",
    align: "right",
    width: 180,
    orderable: true,
  },
  {
    label: "Vencimento",
    name: "expiration_date",
    orderable: true,
  },
  {
    label: "Vendido",
    name: "sold",
    align: "center",
    orderable: true,
    width: 30,
    format: (currentValue, allValues) =>
      currentValue && (
        <Tooltip label={`Vendido em ${allValues.sale_date}`}>
          <div style={{ display: "inline-block" }}>
            <FiCheckSquare size={18} color="#188d4f" />
          </div>
        </Tooltip>
      ),
  },
  {
    label: "Preço Venda",
    name: "sale_price",
    align: "right",
    orderable: true,
    width: 170,
  },
  {
    label: "Lucro",
    name: "profit",
    align: "right",
    width: 130,
  },
  { label: "Cliente", name: "client_name", align: "right" },
];

export function UnitsTable(props: UnitsTableProps) {
  const { fetchUnits, units, setFilters } = props;
  const [currentOrder, setCurrentOrder] = React.useState<null | string[]>();

  const [action, setAction] = React.useState<null | {
    type: "sell" | "edit" | "delete";
    unit: Unit;
  }>(null);

  const confirmation = useConfirmation();
  const toast = useToast();

  const handleDelete = React.useCallback(
    async (id: number) => {
      confirmation({
        title: "Excluir unidade?",
        description: "Não será possível recuperá-la",
      }).then(async () => {
        await api.delete(`/units/${id}`);
        fetchUnits();
        toast({ status: "success", title: "Unidade excluída" });
      });
    },
    [fetchUnits, toast, confirmation]
  );

  const unitsToShow = React.useMemo(() => {
    return units.data;
  }, [units]);

  const handleChangeOrder = React.useCallback(
    (col: Column) => {
      let newState;

      if (currentOrder && currentOrder[0] === col.name) {
        newState = [col.name, currentOrder[1] === "asc" ? "desc" : "asc"];
      } else {
        newState = [col.name, "asc"];
      }

      setCurrentOrder(newState);
      setFilters((curr) => ({
        ...curr,
        orderBy: newState[0],
        sort: newState[1],
      }));
    },
    [currentOrder, setFilters]
  );

  const contextActions: (unit: Unit) => Action[] = React.useCallback(
    (unit: Unit) => [
      {
        label: "Vender",
        icon: <FiDollarSign />,
        hide: unit.sold,
        onClick: () => setAction({ type: "sell", unit }),
      },
      {
        label: "Editar",
        icon: <FiEdit />,
        onClick: () => setAction({ type: "edit", unit }),
      },
      {
        label: "Excluir",
        icon: <FiTrash />,
        onClick: () => handleDelete(unit.id),
      },
    ],
    [handleDelete]
  );

  return (
    <>
      {action !== null && action.type === "sell" && (
        <SellUnit
          onClose={() => setAction(null)}
          open={!!action}
          unit={action.unit}
          afterSubmit={fetchUnits}
        />
      )}

      {action !== null && action.type === "edit" && (
        <EditUnit
          onClose={() => setAction(null)}
          open={!!action}
          unitId={action.unit.id}
          afterSubmit={fetchUnits}
        />
      )}

      <ChakraTable variant="striped" size="sm">
        <Thead>
          <Tr>
            {tableColumns.map((col) => (
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
          {unitsToShow.map((row) => (
            <ContextMenu<HTMLDivElement>
              renderMenu={() => (
                <MenuList>
                  {contextActions(row).map(
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
                  {tableColumns.map((col) => (
                    <Td textAlign={col.align} key={`col-${row.id}-${col.name}`}>
                      {col.format
                        ? col.format(row[col.name], row)
                        : row[col.name]}
                    </Td>
                  ))}
                </Tr>
              )}
            </ContextMenu>
          ))}
        </Tbody>
      </ChakraTable>
    </>
  );
}
