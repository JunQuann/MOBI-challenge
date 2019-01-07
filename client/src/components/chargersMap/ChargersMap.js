import React from "react";
import { withGoogleMap, GoogleMap } from "react-google-maps";
import ChargerMarker from "./ChargerMarkers";

const ChargersMap = withGoogleMap((props) => {

    const markers = props.chargers.map( charger => <ChargerMarker 
            key={charger.chargerId}
            charger={charger}
            location={{
                lat: charger.lat,
                lng: charger.lng
            }}
        />);
    return (
        <GoogleMap
            defaultZoom={11}
            center={props.position}
        >
            {markers}
        </GoogleMap>
    );
})


export default ChargersMap;