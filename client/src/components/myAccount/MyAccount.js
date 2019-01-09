import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { drizzleConnect } from 'drizzle-react';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

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

    constructor(props, context) {
         super(props);
         this.contracts = context.drizzle.contracts;
    }

    state = {
        balanceDataKey: null,
        balance: null,
        updated: false,
        value: ""
    }

    componentDidMount() {
        const balanceDataKey = this.contracts.P2Pcharging.methods["walletBalance"].cacheCall(this.props.accounts[0])
        this.setState({
            balanceDataKey
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.P2Pcharging.walletBalance !== prevProps.P2Pcharging.walletBalance || !this.state.updated) {
            this.setState({
                updated: true
            })
            this.fetchWalletBalance();
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    fetchWalletBalance = () => {
        const { walletBalance } = this.props.P2Pcharging;
        const balance = walletBalance[this.state.balanceDataKey];
        if (balance && balance.value) {
            this.setState({
                balance: web3.utils.fromWei(balance.value, "ether")
            })
        }
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.withdrawBalance(this.state.value)
            this.setState({
                value: ""
            })
        }
    }

    withdrawBalance = value => {
        this.contracts.P2Pcharging.methods.withdraw(web3.utils.toWei(value.toString(), "ether")).send({
            from: this.props.accounts[0]
        });
    }

    render() {
        const { classes, P2Pcharging } = this.props;

        return (
            <Grid container justify="center">
                <Grid item xs={8}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h5" component="h3">
                            Wallet Balance
                        </Typography>
                        <Typography variant="h2" style={{margin: '20px'}}>
                            {this.state.balance} ETHER
                        </Typography>
                        <form className={classes.container} autoComplete="off">
                            <TextField
                            label="Amount to withdraw..."
                            className={classes.textField}
                            value={this.state.value}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
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

MyAccount.contextTypes = {
    drizzle: PropTypes.object 
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        transactions: state.transactions,
        transactionStack: state.transactionStack,
        P2Pcharging: state.contracts.P2Pcharging
    }
  }

export default withStyles(styles)(drizzleConnect(MyAccount, mapStateToProps));
