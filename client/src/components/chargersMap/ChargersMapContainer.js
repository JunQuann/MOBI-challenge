import React, { Component } from 'react';
import PropTypes from 'prop-types'
import ChargersMap from './ChargersMap';
import Geocode from "react-geocode";
import { drizzleConnect } from 'drizzle-react';

class ChargersMapContainer extends Component {

    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts
        this.state = {
            chargersCountDataKey: null,
            chargers: []
        }
    }

    componentDidMount() {
        Geocode.setApiKey("AIzaSyCu3lFSwPhFG8kXOtd5zqPMnjR0SfcLm1M");
        const chargersCountDataKey = this.contracts.P2Pcharging.methods["chargersCount"].cacheCall();
        this.setState({
            chargersCountDataKey
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.P2Pcharging !== prevProps.P2Pcharging || this.state.chargers.length === 0) {
            const { P2Pcharging } = this.props;
            const chargersCount = P2Pcharging.chargersCount[this.state.chargersCountDataKey];
            if (chargersCount && chargersCount.value) {
                for (let i = 1; i <= chargersCount.value; i++) {
                    this.contracts.P2Pcharging.methods.getCharger(i).call().then(charger => {
                        const chargerAddress = charger.chargerAddress;
                        if (chargerAddress) {
                            Geocode.fromAddress(chargerAddress).then(response => {
                                const { lat, lng } = response.results[0].geometry.location;
                                charger = {...charger, lat, lng}
                                this.setState({
                                    chargers: [
                                        ...this.state.chargers,
                                        charger
                                    ]
                                })
                            }, error => {
                                console.error(error);
                            })
                        }
                    })
                }
            }
        }
    }

    render() {
        return (
            <ChargersMap
                loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `630px`}} />}
                mapElement={<div style={{ height: `100%` }} />}
                chargers={this.state.chargers}
                position={this.props.position}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts,
        P2Pcharging: state.contracts.P2Pcharging
    }
}

ChargersMapContainer.contextTypes = {
    drizzle: PropTypes.object
}

export default drizzleConnect(ChargersMapContainer, mapStateToProps)