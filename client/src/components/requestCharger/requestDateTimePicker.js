import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

const styles = {
    grid: {
        width: '100%',
        marginTop: '10px',
    },
};

class requestDatetimePicker extends React.Component {

  render() {
    const { classes, selectedStartDate, selectedEndDate, handleStartDateChange, handleEndDateChange } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container className={classes.grid} justify="space-around">
            <DatePicker
                margin="dense"
                label="Start Date"
                value={selectedStartDate}
                onChange={handleStartDateChange}
            />
            <TimePicker
                margin="dense"
                label="Start Time"
                value={selectedStartDate}
                onChange={handleStartDateChange}
            />
        </Grid>
        <Grid container className={classes.grid} justify="space-around">
            <DatePicker
                margin="dense"
                label="End Date"
                value={selectedEndDate}
                onChange={handleEndDateChange}
            />
            <TimePicker
                margin="dense"
                label="End Time"
                value={selectedEndDate}
                onChange={handleEndDateChange}
            />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

requestDatetimePicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(requestDatetimePicker);