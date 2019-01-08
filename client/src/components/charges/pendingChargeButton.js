import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { drizzleConnect } from 'drizzle-react'

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class PendingChargeButton extends React.Component {

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
    }

    state = {
        open: false,
        approveStackId: null,
        rejectStackId: null
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleApproveRequest = () => {
        const { chargeId } = this.props;
        const approveStackId = this.contracts.P2Pcharging.methods.updateChargeStatus.cacheSend(
            chargeId,
            "2"
        );
        this.setState({
            approveStackId
        })
        this.handleClose()
    }

    getApproveTxStatus = () => {
        const { transactions, transactionStack } = this.props;
        const txHash = transactionStack[this.state.approveStackId];
        if (!txHash) return console.log('No approve txHash');
        return console.log(transactions[txHash].status);
    }

    handleRejectRequest = () => {
        const { chargeId } = this.props;
        const rejectStackId = this.contracts.P2Pcharging.methods.updateChargeStatus.cacheSend(
            chargeId,
            "1"
        )
        this.setState({
            rejectStackId
        })
        this.handleClose()
    }

    getRejectTxStatus = () => {
        const { transactions, transactionStack } = this.props;
        const txHash = transactionStack[this.state.rejectStackId];
        if (!txHash) return console.log('No reject txHash');
        return console.log(transactions[txHash].status);
    }

    render() {
        return (
            <div>
                <Button variant="contained" style={{backgroundColor: 'orange'}} onClick={this.handleClickOpen}>
                    Pending
                </Button>
                <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                >
                <DialogTitle id="alert-dialog-slide-title">
                    {"Approve or Reject this request?"}
                </DialogTitle>
                <DialogActions>
                    <Button variant="outlined" onClick={this.handleApproveRequest} color="primary">
                        Approve
                    </Button>
                    <Button variant="outlined" onClick={this.handleRejectRequest} color="secondary">
                        Reject
                    </Button>
                </DialogActions>
                </Dialog>
                {this.getApproveTxStatus()}
                {this.getRejectTxStatus()}
            </div>
        );
    }
}

PendingChargeButton.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
        transactions: state.transactions,
        transactionStack: state.transactionStack,
        P2Pcharging: state.contracts.P2Pcharging
    }
}

export default drizzleConnect(PendingChargeButton, mapStateToProps);
