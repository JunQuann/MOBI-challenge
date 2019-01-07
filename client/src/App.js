import React, { Fragment } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { BrowserRouter as Router, Route } from "react-router-dom"

import ChargersMapContainer from './components/chargersMap/ChargersMapContainer';
import RegisterCharger_1 from './components/registerCharger/RegisterCharger_1';
import SearchAppBar from './components/appBar';
import ChargesTab from './components/charges/Charges'

class App extends React.Component {

    state = {
        position: {
            lat: 37.403934199999995,
            lng:  -122.0794253            
        }
    }
  
    handleAddressInput = (lat, lng) => {
        this.setState({
            position: {
                lat: lat,
                lng: lng
            }
        })
    }

    render() {
        const { drizzleStatus } = this.props;
        if (!drizzleStatus.initialized) return "Loading Page...";
        return (
            <Router>
                <Fragment>
                    <SearchAppBar handleAddressInput={this.handleAddressInput} />
                    <Route path="/" exact render={() => <ChargersMapContainer position={this.state.position}/>} />
                    <Route path="/host/" component={RegisterCharger_1} />
                    {/* <Route path="/account/" component={() => <div>account</div>} /> */}
                    <Route path="/charges/" component={ChargesTab} />
                </Fragment>
            </Router>
        )
    }
}

const mapStateToProps = state => {
    return {
        drizzleStatus: state.drizzleStatus,
        web3: state.web3
    }
}

export default drizzleConnect(App, mapStateToProps);
