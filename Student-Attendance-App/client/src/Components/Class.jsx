import React, { useEffect, useState } from "react";
import { client } from "./Client";
import gql from "graphql-tag";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const Class = () => {
  const [data, setdata] = useState([]);
  const [classes, setclass] = useState([]);
  //get
  useEffect(() => {
    client
      .query({
        query: gql`
          query getClass {
            getClass {
              id
              class_name
            }
          }
        `,
      })
      .then((r) => {
        setdata(r.data.getClass);
      });
  }, []);
  console.log(data);

  //post
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(classes);

    client.query({
      query: gql`
        query postClass($class_name: Int) {
          postClass(class_name: $class_name) {
            id
            class_name
          }
        }
      `,
      variables: {
        class_name: +classes,
      },
    });
  };

  //update

  //delete
  const handledelete = (id) => {
    console.log("id", id);
    client.query({
      query: gql`
        query deleteClass($id: Int) {
          deleteClass(id: $id) {
            id
          }
        }
      `,
      variables: { id },
    });
  };

  //3
  return (
    <>
    {/* get class table */}
      <Box width="100%">
        <Box width="60%" margin="auto" marginTop="40px">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">CLASS_NAME</TableCell>
                  <TableCell align="center">DELETE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((e) => (
                  <TableRow
                    key={e.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{e.id}</TableCell>
                    <TableCell align="center">{e.class_name}</TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handledelete(e.id)}
                    >
                      <DeleteIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* post class data into table*/}
      <Box
        width={{ base: "90%", sm: "90%", md: "30%", lg: "30%" }}
        margin="auto"
        margin-top="200px"
        padding="30px"
        borderRadius="20px"
        textAlign="center"
        boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
      >
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <h2 style={{ fontSize: "30px", fontWeight: "600" }}>
            Add class from here
          </h2>
          <FormControl ontrol fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">Select Class</InputLabel>
            <Select
              required
              onChange={(e) => setclass(e.target.value)}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Class"
            >
              <MenuItem value={1}>Class 1</MenuItem>
              <MenuItem value={2}>Class 2</MenuItem>
              <MenuItem value={3}>Class 3</MenuItem>
              <MenuItem value={4}>Class 4</MenuItem>
              <MenuItem value={5}>Class 5</MenuItem>
              <MenuItem value={6}>Class 6</MenuItem>
              <MenuItem value={7}>Class 7</MenuItem>
              <MenuItem value={8}>Class 8</MenuItem>
              <MenuItem value={9}>Class 9</MenuItem>
              <MenuItem value={10}>Class 10</MenuItem>
              <MenuItem value={11}>Class 11</MenuItem>
              <MenuItem value={12}>Class 12</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
};
