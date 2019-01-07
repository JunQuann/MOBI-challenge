import React from "react";
import { Marker, InfoWindow } from "react-google-maps";
import RequestBookingDialog from "../requestCharger/RequestBookingDialog";
import ChargingIcon from "../../images/charging.png";

class ChargerMarker extends React.Component {

    state = { 
        isInfoWindowOpen: false
    }

    toggleInfoWindowOpen = () => {
        this.setState({
            isInfoWindowOpen: !this.state.isInfoWindowOpen
        })
    }

    render(){
        return(
            <Marker
            position={this.props.location}
            icon={ChargingIcon}
            onClick={this.toggleInfoWindowOpen}
            >
            {
                this.state.isInfoWindowOpen && 
                <InfoWindow>
                    <RequestBookingDialog charger={this.props.charger}/>
                </InfoWindow>
            }
            </Marker>
        );
    }
}

export default ChargerMarker;