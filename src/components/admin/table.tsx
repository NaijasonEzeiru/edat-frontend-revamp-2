import * as React from "react";
import NextLink from "next/link";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

// dynamic objects

interface ColumnFormatting {
  type: string;
  options?: {
    [key: string]: string;
  };
  format?: string;
}
interface ColumnDef {
  column: string;
  columnHeader: string;
  width: string;
  columnFormatting?: ColumnFormatting;
}

// dynamic objects
interface Row {
  [key: string]: string;
}

interface LinkOptions {
  [key: string]: {
    link: string;
  };
}
interface TableConfig {
  linksTo: LinkOptions;
  uniqueIdentifier: string;
}

interface TableData {
  columnsDef: Array<ColumnDef>;
  rows: Array<Row>;
  tableConfig?: TableConfig;
}

interface CellData {
  columnsDef: Array<ColumnDef>;
  rows: Array<Row>;
  tableConfig?: TableConfig;
  rowsPerPage: number;
  page: number;
}

function CellRenderer(renderProps: CellData) {
  const columnsDef = renderProps.columnsDef;
  const rows = renderProps.rows;
  const tableConfig = renderProps.tableConfig;
  const rowsPerPage = renderProps.rowsPerPage;
  const page = renderProps.page;

  return (
    <React.Fragment>
      {(rowsPerPage > 0
        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : rows
      ).map((row: Row, index) => (
        <TableRow key={index}>
          {columnsDef.map((columnDef: ColumnDef) =>
            tableConfig &&
            tableConfig["linksTo"].hasOwnProperty(columnDef.column) ? (
              <TableCell key={columnDef.column + index}>
                <NextLink
                  className=" hover:text-green-700 pl-1 text-blue-700"
                  href={tableConfig["linksTo"][columnDef.column].link.replace(
                    ":" + tableConfig["uniqueIdentifier"],
                    row[tableConfig["uniqueIdentifier"]]
                  )}
                  // width={columnDef.width ? columnDef.width : '10%'}
                >
                  {row[columnDef.column]}
                </NextLink>
              </TableCell>
            ) : (
              <TableCell
                key={columnDef.column + index}
                width={columnDef.width ? columnDef.width : "10%"}
              >
                {row[columnDef.column]}
              </TableCell>
            )
          )}

          {tableConfig &&
          tableConfig["linksTo"].hasOwnProperty("editAction") ? (
            <TableCell width="5%" align="center">
              <NextLink
                href={tableConfig["linksTo"]["editAction"].link.replace(
                  ":" + tableConfig["uniqueIdentifier"],
                  row[tableConfig["uniqueIdentifier"]]
                )}
              >
                <EditIcon />
              </NextLink>
            </TableCell>
          ) : (
            ""
          )}

          {tableConfig &&
          tableConfig["linksTo"].hasOwnProperty("deleteAction") ? (
            <TableCell width="5%" align="center">
              <NextLink
                href={tableConfig["linksTo"]["deleteAction"].link.replace(
                  ":" + tableConfig["uniqueIdentifier"],
                  row[tableConfig["uniqueIdentifier"]]
                )}
              >
                <DeleteIcon />
              </NextLink>
            </TableCell>
          ) : (
            ""
          )}
        </TableRow>
      ))}
    </React.Fragment>
  );
}

function formatValues(columnsDef: Array<ColumnDef>, rows: Array<Row>) {
  const formatData: {
    [key: string]: (
      columnFormatting: ColumnFormatting,
      value: string
    ) => string;
  } = {
    date: function (columnFormatting: ColumnFormatting, value: string) {
      return value ? moment(value).format(columnFormatting.format) : value;
    },
    select: function (columnFormatting: ColumnFormatting, value: string) {
      return "options" in columnFormatting && columnFormatting.options![value]
        ? columnFormatting.options![value]
        : value;
    },
  };
  rows.map(function (val, index) {
    Object.keys(val).forEach((key) => {
      let columnDefinition = columnsDef.find(
        (columnDef) => columnDef.column == key
      );

      if (
        columnDefinition !== undefined &&
        columnDefinition.hasOwnProperty("columnFormatting")
      ) {
        let columntType: string = columnDefinition.columnFormatting!.type;
        val[key] = formatData[columntType](
          columnDefinition.columnFormatting!,
          val[key]
        );
      }
    });
  });
}

export default function TableViewer(props: TableData) {
  // props varibales
  // const totalNoOfRows = props.totalNoOfRows;
  const columnsDef: Array<ColumnDef> = props.columnsDef;
  const rows = props.rows;
  const tableConfig = props.tableConfig;

  formatValues(columnsDef, rows);

  // state variables
  //const [order, setOrder] = React.useState<Order>('asc');
  //const [orderBy, setOrderBy] = React.useState<keyof Data>('calories');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow className="bg-primary">
            {columnsDef.map((columnDef: ColumnDef) => (
              <TableCell
                key={columnDef.column}
                sx={{ color: "white", fontWeight: 600 }}
                width={columnDef.width ? columnDef.width : "10%"}
              >
                {columnDef.columnHeader}
              </TableCell>
            ))}
            {tableConfig &&
            (tableConfig["linksTo"].hasOwnProperty("deleteAction") ||
              tableConfig["linksTo"].hasOwnProperty("editAction")) ? (
              <TableCell
                colSpan={2}
                width="10%"
                sx={{ color: "white", fontWeight: 600 }}
                align="center"
              >
                Actions
              </TableCell>
            ) : (
              ""
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, id) => (
            <tr key={id}></tr>
          ))}
          <CellRenderer
            columnsDef={columnsDef}
            rows={rows}
            tableConfig={tableConfig}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
}
