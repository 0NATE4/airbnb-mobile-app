import React, { memo, useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-map-clustering";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "../constants/Styles";
import Colors from "../constants/Colors";

export interface Listing {
  id: number;
  host_id: number;
  latitude: number;
  longitude: number;
  price: string;
}

interface Props {
  listingData: Listing[];
  onMarkerPress?: (item: Listing) => void;
}

const INITIAL_REGION = {
  latitude: 41.3851,
  longitude: 2.1734,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const debouncedRenderMarkers = (
  data: Listing[],
  setDebouncedListingData: React.Dispatch<React.SetStateAction<Listing[]>>
) => {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      setDebouncedListingData(data);
    }, 100);
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  };
};

const ListingsMap = memo(({ listingData, onMarkerPress }: Props) => {
  const listingDataRef = useRef<Listing[]>(listingData);
  const [debouncedListingData, setDebouncedListingData] = React.useState<Listing[]>([]);
  const debouncedRender = useCallback(
    debouncedRenderMarkers(listingDataRef.current, setDebouncedListingData),
    [setDebouncedListingData]
  );

  useEffect(() => {
    listingDataRef.current = listingData;
    const cleanup = debouncedRender();
    return cleanup;
  }, [listingData, debouncedRender]);

  const renderCluster = (cluster: any) => {
    const { id, properties, geometry, onPress } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={id}
        onPress={onPress}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
      >
        <View style={styles.cluster}>
          <Text style={{ fontFamily: "mon-sb", fontSize: 14 }}>{points}</Text>
        </View>
      </Marker>
    );
  };

  const handleMarkerPress = (item: Listing) => {
    if (onMarkerPress) {
      onMarkerPress(item);
    }
  };

  return (
    <View style={defaultStyles.container}>
      <MapView
        animationEnabled={false}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_DEFAULT}
        clusterColor="#fff"
        clusterTextColor="#000"
        clusterFontFamily="mon-sb"
        renderCluster={renderCluster}
      >
        {debouncedListingData.map((item) => (
          <Marker
            key={`${item.id}${item.host_id}`}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            onPress={() => handleMarkerPress(item)}
          >
            <View style={styles.marker}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.markerText}>{item.price || "$N/A"}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

export default ListingsMap;

const styles = StyleSheet.create({
  marker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#A3A3A3",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: "mon-sb",
  },
  cluster: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});
