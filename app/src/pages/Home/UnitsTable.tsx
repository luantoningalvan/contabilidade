import * as React from "react";

import { useToast, Tooltip } from "@chakra-ui/react";
import { FiCheckSquare, FiEdit, FiTrash } from "react-icons/fi";
import { api } from "../../services/api";
import { Unit } from "./types";

import { Table } from "../../components/Table";
import { FiDollarSign } from "react-icons/fi";
import { SellUnit } from "../../shared/units/SellUnit";
import { useConfirmation } from "../../hooks/useConfirmation";
import { EditUnit } from "../../shared/units/EditUnit";

interface UnitsTableProps {
  fetchUnits: any;
  units: any;
  setFilters: any;
}

export function UnitsTable(props: UnitsTableProps) {
  const { fetchUnits, units, setFilters } = props;

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

      <Table
        onOrderChange={(v) =>
          setFilters((curr) => ({
            ...curr,
            orderBy: v[0],
            sort: v[1],
          }))
        }
        columns={[
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
            format: (v, all) =>
              v && (
                <Tooltip label={`Vendido em ${all.sale_date}`}>
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
        ]}
        data={unitsToShow}
        contextActions={(unit: Unit) => [
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
        ]}
      />
    </>
  );
}
