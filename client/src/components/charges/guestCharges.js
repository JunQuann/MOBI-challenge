import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { format, isAfter } from 'date-fns';


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 400,
    },
    title: {
        flex: '0 0 auto',
        margin: theme.spacing.unit * 3
    },
    button: {
        margin: theme.spacing.unit,
    }
});

class GuestChargesTable extends React.Component {

    state = {
        futureCharges: [],
        pastCharges: []
    }

    populateCharges = () => {
        const now = new Date()
        const { guestCharges } = this.props
        for (let i = 0; i < guestCharges.length; i++) {
            const guestCharge = guestCharges[i]
            if (isAfter(guestCharge.startDatetime, now)) {
                this.setState({
                    futureCharges: [
                        ...this.state.futureCharges,
                        guestCharge
                    ]
                })
            } else {
                this.setState({
                    pastCharges: [
                        ...this.state.pastCharges,
                        guestCharge
                    ]
                })
            }
        }
    }

    componentDidMount() {
        this.populateCharges();
    }

    componentDidUpdate(prevProps) {
        if (this.props.guestCharges !== prevProps.guestCharges) {
            this.populateCharges();
        }
    }

    renderStatusButton = (status) => {
        console.log('here')
        const { classes } = this.props;
        switch (status) {
            case "0":
                return (
                    <Button variant="contained" className={classes.button} style={{backgroundColor: 'orange'}}>
                        Pending
                    </Button>
                )
            case "1":
            case "2":
            case "3":
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        console.log(this.state);
        return (
            <Grid item xs={10}>
                <Paper className={classes.root}>
                    <div className={classes.title}>
                        <Typography variant="h6">
                            Future Charges
                        </Typography>
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell align="right">Start</TableCell>
                            <TableCell align="right">End</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.futureCharges.map(charge => {
                                return (
                                    <TableRow key={charge.chargeId}>
                                        <TableCell component="th" scope="row">
                                            {charge.charger.chargerAddress}  
                                        </TableCell>
                                        <TableCell align="right">
                                            {format(charge.startDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {format(charge.endDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell align="right">{charge.value}</TableCell>
                                        <TableCell align="right">{this.renderStatusButton(charge.status)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Paper>
                <Paper className={classes.root}>
                    <div className={classes.title}>
                        <Typography variant="h6">
                            Charge History
                        </Typography>
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell align="left">Start</TableCell>
                            <TableCell align="left">End</TableCell>
                            <TableCell align="left">Price</TableCell>
                            <TableCell align="left">Status</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.pastCharges.map(charge => {
                                return (
                                    <TableRow key={charge.chargeId}>
                                        <TableCell component="th" scope="row">
                                            {charge.charger.chargerAddress}  
                                        </TableCell>
                                        <TableCell align="left">
                                            {format(charge.startDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell align="left">
                                            {format(charge.endDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell align="left">{charge.value}</TableCell>
                                        <TableCell align="left">{this.renderStatusButton(charge.status)}</TableCell>
                                    </TableRow>
                                )
                            })} 
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        );
    }
}

GuestChargesTable.propTypes = {
classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GuestChargesTable);
