import React, { useCallback, useState } from "react";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

type Column = {
  label: string;
  name: string;
  align?: "inherit" | "left" | "right" | "center" | "justify";
  width?: number | string;
  format?: (v: any) => React.ReactElement | string;
};

type Action = {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
};

interface TableProps {
  columns: Column[];
  data: any[];
  contextActions?: (row: any) => Action[];
}

export const Table = (props: TableProps) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currRow, setCurrRow] = useState(null);

  const handleShowActions = useCallback(
    (e: React.MouseEvent, row) => {
      e.preventDefault();
      setCurrRow(row);
      setMenuAnchor(
        menuAnchor === null
          ? {
              mouseX: e.clientX - 2,
              mouseY: e.clientY - 4,
            }
          : null
      );
    },
    [menuAnchor]
  );

  return (
    <>
      {props.contextActions && (
        <Menu
          open={!!menuAnchor}
          anchorPosition={
            menuAnchor !== null
              ? { top: menuAnchor.mouseY, left: menuAnchor.mouseX }
              : undefined
          }
          onClose={() => setMenuAnchor(null)}
          anchorReference="anchorPosition"
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          onMouseDown={() => {
            setMenuAnchor(null);
          }}
          disableAutoFocusItem
        >
          {currRow &&
            props.contextActions(currRow).map((action, index) => (
              <MenuItem key={`act-${index}`} onClick={action.onClick}>
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText>{action.label}</ListItemText>
              </MenuItem>
            ))}
        </Menu>
      )}

      <MUITable stickyHeader aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            {props.columns.map((col) => (
              <TableCell
                variant="head"
                key={col.name}
                width={col.width}
                align={col.align}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow
              key={`col-${row.id}`}
              hover
              onContextMenu={(e) => handleShowActions(e, row)}
            >
              {props.columns.map((col) => (
                <TableCell align={col.align} key={`col-${row.id}-${col.name}`}>
                  {col.format ? col.format(row[col.name]) : row[col.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </>
  );
};
