import React, { useState, useEffect } from "react";
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
import EditIcon from "@mui/icons-material/Edit";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export const Students = () => {
  const [data, setdata] = useState([]);
  const [name, setname] = useState([]);
  const [email, setemail] = useState([]);
  const [parent_name, setparent] = useState([]);
  const [phone, setphone] = useState([]);
  const [classes, setclass] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setid] = useState(0);


  //get
  useEffect(() => {
    client
      .query({
        query: gql`
          query getStudents {
            getStudents {
              id
              name
              email
              parent_name
              phone
              class
            }
          }
        `,
      })
      .then((r) => {
        setdata(r.data.getStudents);
      });
  }, []);
  console.log(data);

  //post
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, phone, parent_name, classes);

    client.query({
      query: gql`
        query postStudents(
          $name: String
          $email: String
          $parent_name: String
          $phone: Int
          $class: Int
        ) {
          postStudents(
            name: $name
            email: $email
            parent_name: $parent_name
            phone: $phone
            class: $class
          ) {
            id
            name
            email
            parent_name
            phone
            class
          }
        }
      `,
      variables: {
        name,
        email,
        phone: +phone,
        parent_name,
        class: +classes,
      },
    });
  };

  //update
  const handledit = () => {
    console.log(name, email, phone, parent_name, classes);
    client
      .query({
        query: gql`
          query updateStudents(
            $id: Int
            $name: String
            $email: String
            $parent_name: String
            $phone: Int
            $class: Int
          ) {
            updateStudents(
              id: $id
              name: $name
              email: $email
              parent_name: $parent_name
              phone: $phone
              class: $class
            ) {
              id
              name
              email
              parent_name
              phone
              class
            }
          }
        `,
        variables: {
          id: +id,
          name,
          email,
          parent_name,
          phone: +phone,
          class: +classes,
        },
      })
      .then((r) => {
        setdata(r.data.updateStudents);
      });
  };

  //delete
  const handledelete = (id) => {
    console.log("id", id);
    client.query({
      query: gql`
        query deleteStudents($id: Int) {
          deleteStudents(id: $id) {
            id
          }
        }
      `,
      variables: { id },
    });
  };

  const handleClickOpen = (student_id) => {
    setid(student_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  return (
    <>
      {/* get student data table */}
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
                  <TableCell align="center">NAME</TableCell>
                  <TableCell align="center">EMAIL</TableCell>
                  <TableCell align="center">PARENT_NAME</TableCell>
                  <TableCell align="center">PHONE</TableCell>
                  <TableCell align="center">CLASS</TableCell>
                  <TableCell align="center">DELETE</TableCell>
                  <TableCell align="center">UPDATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((e) => (
                  <TableRow
                    key={e.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{e.id}</TableCell>
                    <TableCell align="center">{e.name}</TableCell>
                    <TableCell align="center">{e.email}</TableCell>
                    <TableCell align="center">{e.parent_name}</TableCell>
                    <TableCell align="center">{e.phone}</TableCell>
                    <TableCell align="center">{e.class}</TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handledelete(e.id)}
                    >
                      <DeleteIcon />
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handleClickOpen(e.id)}
                    >
                      <EditIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* post student data into table*/}
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
            Add students from here
          </h2>
          <TextField
            required
            onChange={(e) => setname(e.target.value)}
            id="outlined-basic"
            label="Enter Name"
            margin="dense"
            fullWidth
            variant="filled"
          />
          <TextField
            required
            onChange={(e) => setparent(e.target.value)}
            id="outlined-basic"
            label="Enter Parent Name"
            margin="dense"
            fullWidth
            variant="filled"
          />
          <TextField
            required
            onChange={(e) => setemail(e.target.value)}
            type="email"
            id="filled-basic"
            label="Enter Email"
            margin="dense"
            fullWidth
            variant="filled"
          />
          <TextField
            required
            onChange={(e) => setphone(e.target.value)}
            type="number"
            id="outlined-basic"
            label="Enter Phone No"
            margin="dense"
            fullWidth
            variant="filled"
          />
          <FormControl fullWidth margin="dense">
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
      {/* update data */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update</DialogTitle>
        <DialogContent>
          <DialogContentText>Update your data</DialogContentText>
          <TextField
            required
            onChange={(e) => setname(e.target.value)}
            id="outlined-basic"
            label="Enter Name"
            margin="dense"
            fullWidth
            variant="filled"
          />

          <TextField
            required
            onChange={(e) => setparent(e.target.value)}
            id="outlined-basic"
            label="Enter Parent Name"
            margin="dense"
            fullWidth
            variant="filled"
          />

          <TextField
            required
            onChange={(e) => setemail(e.target.value)}
            type="email"
            id="filled-basic"
            label="Enter Email"
            margin="dense"
            fullWidth
            variant="filled"
          />
          <TextField
            required
            onChange={(e) => setphone(e.target.value)}
            type="number"
            id="outlined-basic"
            label="Enter Phone No"
            margin="dense"
            fullWidth
            variant="filled"
          />

          <FormControl fullWidth margin="dense">
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handledit}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
