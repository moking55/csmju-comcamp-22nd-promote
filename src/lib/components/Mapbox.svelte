<script lang="ts">
	import { Map } from 'mapbox-gl';
	import { onMount, onDestroy } from 'svelte';
	import { contract } from '../../data';
	import mapboxgl from 'mapbox-gl';

	let map: Map;
	let marker: mapboxgl.Marker;
	let mapContainer: HTMLElement;
	let lng: number = contract.location.longitude,
		lat: number = contract.location.latitude,
		zoom: number;

	zoom = 17;

	onMount(() => {
		const initialState = { lng: lng, lat: lat, zoom: zoom };

		map = new Map({
			container: mapContainer,
			accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
			style: `mapbox://styles/mapbox/outdoors-v11`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
	});

	onDestroy(() => {
		map.remove();
	});
</script>

<div class="map-wrap">
	<div class="absolute w-full h-full" bind:this={mapContainer} />
</div>
