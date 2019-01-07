import React from 'react';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GuestChargesTable from './guestCharges';
import Grid from '@material-ui/core/Grid';
import { drizzleConnect } from 'drizzle-react'

class ChargesTab extends React.Component {

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
    }

    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

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
                {value == 0 && <GuestChargesTable />}
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