import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RequestDatetimePicker from './requestDateTimePicker';
import { drizzleConnect } from 'drizzle-react';
import { format } from 'date-fns';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

class RequestBookingDialog extends React.Component {
    
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
    }

    state = {
        open: false,
        selectedStartDate: new Date(),
        selectedEndDate: new Date(),
        stackId: null
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleStartDateChange = date => {
        this.setState({ selectedStartDate: date });
    };

    handleEndDateChange = date => {
        this.setState({ selectedEndDate: date});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { chargerId, owner } = this.props.charger;
        const { selectedStartDate, selectedEndDate } = this.state;
        const serializedStartDate = format(selectedStartDate, 't');
        const serializedEndDate = format(selectedEndDate, 't');
        const stackId = this.contracts.P2Pcharging.methods["requestCharge"].cacheSend(
            owner,
            chargerId,
            serializedStartDate,
            serializedEndDate, {
            from: this.props.accounts[0],
            value: web3.utils.toWei("50", "finney")
        });
        this.setState({
            stackId
        })
        this.handleClose();
    }

    render() {
        const { charger } = this.props;
        const { selectedStartDate, selectedEndDate } = this.state;
        return (
        <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Check charger's availability
            </Button>
            <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Request Charger</DialogTitle>
            <DialogContent>
                <Divider variant="middle" />
                <div style={{margin: '20px'}}>
                    <DialogContentText>
                        Charger's Type: {charger.chargerType}
                    </DialogContentText>
                    <DialogContentText>
                        Charger's Voltage: {charger.chargerVoltage}
                    </DialogContentText>
                    <DialogContentText>
                        Charger's Amperage: {charger.chargerAmps}
                    </DialogContentText>
                </div>   
                <Divider variant="middle" />
                <div style={{margin: '20px'}}>
                    <DialogContentText>
                    Please indicate the date and time that you would like to request this charger for:
                    </DialogContentText>
                    <RequestDatetimePicker 
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    handleStartDateChange={this.handleStartDateChange}
                    handleEndDateChange={this.handleEndDateChange}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button type="submit" onClick={this.handleSubmit} color="primary">
                Request
                </Button>
            </DialogActions>
            </Dialog>
        </div>
        );
    }
}

RequestBookingDialog.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
        web3: state.web3,
        accounts: state.accounts,
        transactions: state.transactions,
        transactionStack: state.transactionStack,
        P2Pcharging: state.contracts.P2Pcharging
    }
}

export default drizzleConnect(RequestBookingDialog, mapStateToProps);