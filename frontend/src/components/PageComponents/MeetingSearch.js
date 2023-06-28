import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import { getMeeting } from '../service/apiMeeting';

const MeetingSearch = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8070/meeting");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.subject && item.subject.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredData);
    console.log(filteredData)
  }, [data, query]);

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  console.log(query);

  return (
    <>
      <TextField
        placeholder="Search"
        variant="outlined"
        value={query}
        margin="normal"
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <SearchIcon />
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table id="meetingSearch" sx={{ minWidth: 550 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Organizer</TableCell>
              <TableCell align="right">Platform</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.subject}
                </TableCell>
                <TableCell align="right">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">{item.time}</TableCell>
                <TableCell align="right">{item.organizer}</TableCell>
                <TableCell align="right">{item.platform}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MeetingSearch;
