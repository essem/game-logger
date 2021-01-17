import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import http from '../http';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function Stats() {
  const classes = useStyles();
  const [labels, setLabels] = useState(null);
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState([]);
  const [offset, setOffset] = useState(0);
  const [months, setMonths] = useState(6);
  const [type, setType] = useState('sum');

  useEffect(() => {
    queryStats(offset, months);
  }, [offset, months]);

  const queryStats = async (offset, months) => {
    try {
      const stats = await http.get(
        `/api/stats?offset=${offset}&months=${months}`,
      );
      setLabels(stats.labels);
      setUsers(stats.users);
      setSelected(stats.users.map((u) => u.id));
    } catch (err) {}
  };

  const handleChangeOffset = (e) => {
    const offset = e.target.value;
    setOffset(offset);
    queryStats(offset, months);
  };

  const handleChangeMonths = (e) => {
    const months = e.target.value;
    setMonths(months);
    queryStats(offset, months);
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleClickUser = (checked, id) => {
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((i) => i !== id));
    }
  };

  if (!labels || !users) {
    return <div />;
  }

  let dataFunc = null;
  switch (type) {
    case 'sum':
      dataFunc = (d) => d[0] + d[1];
      break;
    case 'diff':
      dataFunc = (d) => d[0] - d[1];
      break;
    case 'win':
      dataFunc = (d) => d[0];
      break;
    case 'lose':
      dataFunc = (d) => d[1];
      break;
    default:
  }

  const colors = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [75, 192, 192],
    [153, 102, 255],
    [255, 159, 64],
  ];

  const filtered = users.filter((user) => selected.includes(user.id));
  const data = labels.map((label, index) => {
    const col = { label };
    filtered.forEach((user) => {
      col[user.name] = dataFunc(user.data[index]);
    });
    return col;
  });

  return (
    <Container>
      <Paper>
        <Box p={2}>
          <FormControl className={classes.formControl}>
            <Select value={offset} onChange={handleChangeOffset}>
              <MenuItem value={0}>Until now</MenuItem>
              <MenuItem value={3}>3 Months before</MenuItem>
              <MenuItem value={6}>6 Months before</MenuItem>
              <MenuItem value={12}>12 Months before</MenuItem>
              <MenuItem value={24}>24 Months before</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Select value={months} onChange={handleChangeMonths}>
              <MenuItem value={3}>3 Months</MenuItem>
              <MenuItem value={6}>6 Months</MenuItem>
              <MenuItem value={12}>12 Months</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Select value={type} onChange={handleChangeType}>
              <MenuItem value="sum">Win + Lose</MenuItem>
              <MenuItem value="diff">Win - Lose</MenuItem>
              <MenuItem value="win">Win</MenuItem>
              <MenuItem value="lose">Lose</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <br />
      <Paper>
        <Box p={2}>
          <Grid container>
            {users.map((user) => (
              <Grid item key={user.name} xs={6} sm={4} md={3} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onChange={(e) =>
                        handleClickUser(e.target.checked, user.id)
                      }
                      color="primary"
                    />
                  }
                  label={user.name}
                  style={{ marginBottom: 0 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
      <br />
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis dataKey="label" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip itemSorter={(item) => -item.value} />
          <Legend />
          {users.map((user, index) => (
            <Line
              key={user.id}
              type="monotone"
              dataKey={user.name}
              stroke={`rgb(${colors[index % colors.length].join(',')})`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}
