import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: theme.spacing.unit * 4
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    button: {
        marginTop: theme.spacing.unit * 4,
        marginLeft: theme.spacing.unit * 10,
        marginRight: theme.spacing.unit * 10,
    },
});

class MyAccount extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="center">
                <Grid item xs={8}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h5" component="h3">
                            Wallet Balance
                        </Typography>
                        <Typography variant="h2" style={{margin: '20px'}}>
                            0.002 ETHER
                        </Typography>
                        <form className={classes.container} autoComplete="off">
                            <TextField
                            label="Amount to withdraw..."
                            className={classes.textField}
                            // value={}
                            // onChange={}
                            margin="normal"
                            variant="outlined"
                            />
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

MyAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyAccount);
