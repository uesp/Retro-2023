<!-- App -->
<script>

	// import svelte core stuff
	import { onMount } from 'svelte';


	// import data objects
	import Colour from "./colour.js";
  import Icon from '../src/Icon.svelte';
  import MetroButton from '../src/MetroButton.svelte';
  import CircleProgress from '../src/CircleProgress.svelte';

	// consts
	const SCRIPT_ID = 'getRecent';
	const MAX_VALUE = 50;
	// colours
	const COLOUR_GOOD = new Colour(84, 204, 20); 	   //rgb(84, 204, 20)
	const COLOUR_MODERATE = new Colour(233, 153, 63);  //rgb(233, 153, 63)
	const COLOUR_HIGH = new Colour(218, 3, 67); 	   //rgb(218, 3, 67)
	const COLOUR_VERY_HIGH = new Colour(111, 63, 183); //rgb(111, 63, 183)
	let colours = [COLOUR_GOOD, COLOUR_MODERATE, COLOUR_HIGH, COLOUR_VERY_HIGH];

	// state values
	let canvas;
	let meter;
	$: currentReading = 30; // use "$:" to create reactive values
	$: nReading = currentReading / MAX_VALUE;
	let currentColour = COLOUR_GOOD;
	let data = [];
	let drawer;
	let drawerPercentage = 0.20;
	let isDrawerOpen;
	let isKioskMode;


	// get increment
	let increment = (1 / colours.length);
	let incrementValues = [];

	for (let i = 0; i < 1; i += increment) {
		incrementValues.push(i);
	}

	$: {
		console.log(nReading);
		console.log(nIsBetweenIndex(nReading, incrementValues));

		let result = nIsBetweenIndex(nReading, incrementValues);

		// set background to colour
		console.log(betweenColours(colours[result.minIndex], colours[result.maxIndex]));

		if (meter != null) {

			let colour = betweenColours(colours[result.minIndex], colours[result.maxIndex]);
			meter.style.background = colour.toString();
		}

	}


	function betweenColours(colour1, colour2) {

		// get factor between two colours as well

		if (colour1 == colour2) {
			return colour2;
		} else {
			colour1 = colour1.toArray();
			colour2 = colour2.toArray();

			let c1r = colour1[0];
			let c1g = colour1[1];
			let c1b = colour1[2];

			let c2r = colour2[0];
			let c2g = colour2[1];
			let c2b = colour2[2];

			let colour = new Colour(colour1.r + colour2.r / 2);

			return colour
		}
	}

	function nIsBetweenIndex(value, array) {

		let result = nIsBetween(value, array);

		let minIndex = array.indexOf(result.min);
		let maxIndex = ( array.indexOf(result.max) < 1) ? array.length - 1 : array.indexOf(result.max);

		return {minIndex: minIndex, maxIndex: maxIndex};
	}


	function nIsBetween(value, array) {
		for (let i = 0; i < array.length; i++) {

			let min = array[i];
			let max = (i + 1 == array.length) ? 1 : array[i + 1];

			if (value >= min && value <= max) {
				console.log(min);
				console.log(max);
				return {min: min, max: max}
			} else {
				continue;
			}
		}
	}

	// manual update reading function (UI only)
	window.setReading = function setReading(reading){
		currentReading = reading;
	}

	onMount(async () => {

		// circle arc
		if (canvas.getContext) {

			const ctx = canvas.getContext('2d');

			ctx.strokeStyle = 'green';
			ctx.lineWidth = 2;

			const x = 40,
				y = canvas.height / 2,
				space = 10,
				radius = 30,
				arcCount = 7;

			for (let i = 0; i < arcCount; i++) {
				ctx.beginPath();
				ctx.arc(x + i * (radius * 2 + space), y, radius, 0, (i + 1) * (2 * Math.PI) / arcCount, false);
				ctx.stroke();
			}
		}
	});

	function onScroll() {
		drawerPercentage = 0.25 + +(0.30 * getScrollPercentage(drawer));
		console.log(drawerPercentage)

		isDrawerOpen = drawerPercentage > 0.45;
	}

	const scriptBody = {
		"name": SCRIPT_ID,
		"description": `${SCRIPT_ID} returns the latest values`,
	"orgID": "testproject",
	"script": `from(bucket: "airquality") \
	|> range(start: -1d) \
	|> limit(n:10000) \
	|> keep(columns: ["_time", "_value"])`,
	"language": "flux"};

	let output = "output goes here";

	function test() {
		const params = { };
		const body = JSON.stringify({ params });

		fetch(`${INFLUXDB_SERVER}/api/v2/scripts/${SCRIPT_ID}/invoke`, {
			method: 'POST',
			headers: {
				'Authorization': `Token ${INFLUXDB_TOKEN}`,
				'Accept': 'application/csv',
				'Content-Type': 'application/json'
			},
			body
		})
		.then(response => response.text())
		.then(result => handleCSV(result))
		.catch(error => console.error(error));
	}


	function handleCSV(csvString) {
		const rows = csvString.split("\n");


		for (let i = 1; i < rows.length; i++) {
			const columns = rows[i].trim().split(",");


			let time = new Date(Date.parse(columns[3]));
			let value = Number.parseFloat(columns[4]);
			if (value) {
				data.push({'time': time, 'value': value});
			}
		}


		output = data.toString();

		console.log(data);
	}

	function createScript() {
		fetch(`${INFLUXDB_SERVER}/api/v2/scripts`, {
			method: 'POST',
			headers: {
				'Authorization': `Token ${INFLUXDB_TOKEN}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(scriptBody)
		})
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.error(error));
	}

	function deleteScript() {
		fetch(`${INFLUXDB_SERVER}/api/v2/scripts/${SCRIPT_ID}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Token ${INFLUXDB_TOKEN}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.error(error));
	}

	$: counter = 0;


	function getScrollPercentage(el) {
		const percentage = (window.scrollY - el.offsetTop + el.scrollHeight) / el.scrollHeight;
		return percentage < 0 ? 0 : Math.min(percentage, 1)
	}

</script>

<!-- HTML / markup goes here -->
<markup>

	<div class="shade" style="opacity: {drawerPercentage};"/>
	<div id="background"/>

	<div id="meter" bind:this={meter}>

		<div id="circle_meter">
			<CircleProgress size=350 width=2.5></CircleProgress>
		</div>

	</div>

	<div id="drawer" bind:this={drawer}>
		<MetroButton icon="arrow_downward" label="More"></MetroButton>

		<div id="drawer_button">
			<MetroButton icon={isDrawerOpen ? "arrow_upward" : "arrow_downward"}
			label={isDrawerOpen ? null : "More"} labelPosition="inside"></MetroButton>
		</div>


		<button on:click={() => counter++}>counter: {counter}</button>
		<button on:click={createScript}>Create Script</button>
		<button on:click={deleteScript}>Delete Script</button>
		<button on:click={test}>Test</button>


		<canvas bind:this={canvas}></canvas>

		<p>{output}</p>


		{#if data.length > 1}
			<p>{data[0].value}</p>
		{/if}
	</div>

</markup>


<!-- Stylesheet -->
<style global src="./styles/stylesheet.css"></style>

<!-- Global window events -->
<svelte:window on:scroll={onScroll}/>