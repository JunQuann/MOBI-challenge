/*global google*/
import React from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 350,
  },
  textFieldSmall: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 30,
  },
  button: {
    marginTop: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 10,
    marginRight: theme.spacing.unit * 10,
  },
});

class RegisterChargerForm extends React.Component {

  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
  }

  state = {
    stackId: null
  }

  componentDidMount() {
    this.handleScriptLoad()
  }

  handleScriptLoad = () => {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete_1')
    )
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect = () => {
    let addressObject= this.autocomplete.getPlace();
    let address = addressObject.address_components;

    if(address) {
      this.setState({
        address: addressObject.formatted_address
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const stackId = this.contracts.P2Pcharging.methods["registerCharger"].cacheSend(
      this.state.address,
      this.state.type,
      this.state.voltage,
      this.state.amperage, {
      from: this.props.accounts[0]
    });
    this.setState({
      stackId
    })
  }

  getTxStatus = () => {
    const { transactions, transactionStack } = this.props;
    const txHash = transactionStack[this.state.stackId];
    if (!txHash) return console.log('No txHash');
    return console.log(transactions[txHash].status);
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} justify="center">
        <Grid item xs={12}>
          <Typography className={classes.dense} variant="h4" align="center">
            My Listing
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
            <TextField
              id="autocomplete_1"
              label="Address"
              className={classes.textField}
              margin="normal"
              required
              name="address"
            />
            <TextField
              label="Charger Type"
              className={classes.textField}
              margin="normal"
              required
              name="type"
              onChange={this.handleChange}
            />
            <div>
              <TextField 
                label="Voltage"
                className={classes.textFieldSmall}
                margin="normal"
                required
                name="voltage"
                onChange={this.handleChange}
              />
              <TextField 
                label="Amperage"
                className={classes.textFieldSmall}
                margin="normal"
                required
                name="amperage"
                onChange={this.handleChange}
              />
            </div>
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
              Register
            </Button>
          </form>
        </Grid>
        {this.getTxStatus()}
      </Grid>
    )
  }
}

RegisterChargerForm.propTypes = {
  classes: PropTypes.object.isRequired
}

RegisterChargerForm.contextTypes = {
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

export default withStyles(styles)(drizzleConnect(RegisterChargerForm, mapStateToProps));