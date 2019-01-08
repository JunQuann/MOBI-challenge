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
import CompleteChargeButton from './completeChargeButton';


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
        const { charges } = this.props
        for (let i = 0; i < charges.length; i++) {
            const charge = charges[i]
            if (isAfter(charge.startDatetime, now)) {
                this.setState({
                    futureCharges: [
                        ...this.state.futureCharges,
                        charge
                    ]
                })
            } else {
                this.setState({
                    pastCharges: [
                        ...this.state.pastCharges,
                        charge
                    ]
                })
            }
        }
    }

    componentDidMount() {
        this.populateCharges();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charges !== prevProps.charges ) {
            this.populateCharges();
        }
    }

    renderStatusButton = (status, chargeId) => {
        const { classes } = this.props;
        switch (status) {
            case "0":
                return (
                    <Button variant="contained" className={classes.button} style={{backgroundColor: 'orange'}}>
                        Pending
                    </Button>
                )
                case "1":
                return (
                    <Button variant="contained" className={classes.button} style={{backgroundColor: 'Red'}}>
                        Rejected
                    </Button>
                    )
                case "2":
                    return (
                        <CompleteChargeButton chargeId={chargeId} />
                    )
                case "3":
                    return (
                        <Button variant="contained" className={classes.button} style={{backgroundColor: 'Blue'}}>
                            Completed
                        </Button>
                    )
                break;
        }
    }

    renderHistoryStatusButton = (status, chargeId) => {
        const { classes } = this.props;
        switch (status) {
            case "0":
                return (
                    <Button variant="outlined" disabled className={classes.button} style={{color: 'orange'}}>
                        Pending
                    </Button>
                )
            case "1":
                return (
                    <Button variant="outlined" disabled className={classes.button} style={{color: 'red'}}>
                        Rejected
                    </Button>
                )
            case "2":
                return (
                    <Button variant="outlined" disabled className={classes.button} style={{color: 'green'}}>
                        Reserved
                    </Button>
                )
            case "3":
                return (
                    <Button variant="contained" disabled className={classes.button} style={{backgroundColor: 'green'}}>
                        Completed
                    </Button>
                )
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
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
                            <TableCell>Status</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.futureCharges.map(charge => {
                                return (
                                    <TableRow key={charge.chargeId}>
                                        <TableCell component="th" scope="row">
                                            {this.renderStatusButton(charge.status, charge.chargeId)}
                                        </TableCell>
                                        <TableCell>{charge.charger.chargerAddress}</TableCell>
                                        <TableCell>
                                            {format(charge.startDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell>
                                            {format(charge.endDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell>{charge.value}</TableCell>
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
                            <TableCell>Status</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.pastCharges.map(charge => {
                                return (
                                    <TableRow key={charge.chargeId}>
                                        <TableCell component="th" scope="row">
                                            {this.renderHistoryStatusButton(charge.status, charge.chargeId)}
                                        </TableCell>
                                        <TableCell>{charge.charger.chargerAddress}</TableCell>
                                        <TableCell>
                                            {format(charge.startDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell>
                                            {format(charge.endDatetime, "dd MMM yyyy, h:mma")}
                                        </TableCell>
                                        <TableCell>{charge.value}</TableCell>
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
