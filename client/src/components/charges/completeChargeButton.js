import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { drizzleConnect } from 'drizzle-react';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class CompleteChargeButton extends React.Component {

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
    }

    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleCompleteRequest = () => {
        const { chargeId } = this.props;
        this.contracts.P2Pcharging.methods.updateChargeStatus(chargeId, "3").send()
        this.handleClose()
    }

    handleRejectRequest = () => {
        const { chargeId } = this.props;
        this.contracts.P2Pcharging.methods.updateChargeStatus(chargeId, "1").send()
        this.handleClose()
    }

    render() {
        return (
            <div>
                <Button variant="contained" style={{backgroundColor: 'green'}} onClick={this.handleClickOpen}>
                    Reserved
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
                    {"Complete or Cancel this reservation?"}
                </DialogTitle>
                <DialogActions>
                    <Button variant="outlined" onClick={this.handleCompleteRequest} color="primary">
                        Complete
                    </Button>
                    <Button variant="outlined" onClick={this.handleRejectRequest} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        );
    }
}

CompleteChargeButton.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
        P2Pcharging: state.contracts.P2Pcharging
    }
}

export default drizzleConnect(CompleteChargeButton, mapStateToProps);
