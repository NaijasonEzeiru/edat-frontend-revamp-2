import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

const SetCodeTable = ({ classId, data, onSelectionChange, closeForm }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedItems = data.map((item) => item.set_code);
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckboxClick = (event, itemId) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSubmit = () => {
    // You can call your API with the selected items here
    onSelectionChange(classId, selectedItems, closeForm);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>
                                <Checkbox
                                    indeterminate={
                                        selectedItems.length > 0 &&
                                        selectedItems.length < data.length
                                    }
                                    checked={selectedItems.length === data.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell> */}
              <TableCell></TableCell>
              <TableCell>Excerise</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Objective Name</TableCell>
              <TableCell>Status</TableCell>
              {/* Add more columns as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.set_code}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(row.set_code)}
                    onChange={(event) =>
                      handleCheckboxClick(event, row.set_code)
                    }
                    disabled={row.is_assigned}
                  />
                </TableCell>
                <TableCell>{row.set_code}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.learning_outcome}</TableCell>
                <TableCell>
                  <div>
                    {row.is_assigned ? (
                      <span>Assigned</span>
                    ) : (
                      <span>Not Assigned</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: "#1976d2" }}
        onClick={handleSubmit}
        disabled={selectedItems.length === 0}
      >
        Submit
      </Button>

      <Button onClick={closeForm}>Cancel</Button>
    </div>
  );
};

export default SetCodeTable;
