import React from 'react';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GuestChargesTable from './guestCharges';
import HostChargesTable from './hostCharges';
import Grid from '@material-ui/core/Grid';
import { drizzleConnect } from 'drizzle-react';
import { parse } from 'date-fns';

class ChargesTab extends React.Component {

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
    }

    state = {
        value: 0,
        guestCharges: [],
        hostCharges: [],
        updatedGuest: false,
        updatedHost: false,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentDidMount() {
        const guestChargesDataKey = this.contracts.P2Pcharging.methods["getGuestChargesId"].cacheCall();
        const hostChargesDataKey = this.contracts.P2Pcharging.methods["getHostChargesId"].cacheCall();
        this.setState({
            guestChargesDataKey,
            hostChargesDataKey
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.P2Pcharging.getGuestChargesId !== prevProps.P2Pcharging.getGuestChargesId || !this.state.updatedGuest) {
            this.setState({
                updatedGuest: true
            })
            const { P2Pcharging } = this.props;
            const allGuestChargesId = P2Pcharging.getGuestChargesId[this.state.guestChargesDataKey]
            if (allGuestChargesId && allGuestChargesId.value) {
                this.getGuestCharges(allGuestChargesId.value)
            }
        }
        if (this.props.P2Pcharging.getHostChargesId !== prevProps.P2Pcharging.getHostChargesId || !this.state.updatedHost) {
            this.setState({
                updatedHost: true
            })
            const { P2Pcharging } = this.props;
            const allHostChargesId = P2Pcharging.getHostChargesId[this.state.hostChargesDataKey]
            if (allHostChargesId && allHostChargesId.value) {
                this.getHostCharges(allHostChargesId.value)
            }
        }
    }

    getGuestCharges = (allGuestChargesId) => {
        for (let i = 0; i < allGuestChargesId.length; i++) {
            const id = allGuestChargesId[i]
            this.contracts.P2Pcharging.methods.allCharges(id).call().then(charge => {
                charge.startDatetime = parse(charge.startDatetime, 't', new Date())
                charge.endDatetime = parse(charge.endDatetime, 't', new Date())
                this.setState({
                    guestCharges:[
                        ...this.state.guestCharges,
                        charge
                    ]
                })
            })
        }
    }

    getHostCharges = (allHostChargesId) => {
        for (let i = 0; i < allHostChargesId.length; i++) {
            const id = allHostChargesId[i]
            this.contracts.P2Pcharging.methods.allCharges(id).call().then(charge => {
                charge.startDatetime = parse(charge.startDatetime, 't', new Date())
                charge.endDatetime = parse(charge.endDatetime, 't', new Date())
                this.setState({
                    hostCharges:[
                        ...this.state.hostCharges,
                        charge
                    ]
                })
            })
        }
    }

    render() {
        const { value } = this.state;
        return (
            <Grid container justify="center">
                <Grid item xs={12}>
                    <Paper square>
                        <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleChange}
                        >
                            <Tab label="Guest Transactions" />
                            <Tab label="Hosting Transactions" />
                        </Tabs>
                    </Paper>
                </Grid>
                {value === 0 && <GuestChargesTable charges={this.state.guestCharges}/>}
                {value === 1 && <HostChargesTable charges={this.state.hostCharges}/>}
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        P2Pcharging: state.contracts.P2Pcharging
    }
}

ChargesTab.contextTypes = {
    drizzle: PropTypes.object
}

export default drizzleConnect(ChargesTab, mapStateToProps);