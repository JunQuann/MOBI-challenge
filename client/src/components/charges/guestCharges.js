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
});

class GuestChargesTable extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <Grid item xs={8}>
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
                            <TableCell align="right">Start</TableCell>
                            <TableCell align="right">End</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
        
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
