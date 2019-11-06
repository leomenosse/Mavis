var addressPoints = [
	[-37.8839, 175.3745188667, 571],
	[-37.8869090667, 175.3657417333, 486],
	[-37.8894207167, 175.4015351167, 807],
	[-37.8927369333, 175.4087452333, 899]
];

function makeHeatMapPoints(lat, long, intensity){
	let points = [];
	for(let i = 0; i < lat.length; i++){
		points.push([lat, long, intensity]);
	}
	return points;
}