import { wait } from './utils/promise';
import { task, CancellablePromise } from './task';
import { fetchPlaceSummaries, fetchPlaceDetails, PlaceDetails, PlaceSummary } from './utils/places';

const timeout = (n: number) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(`Waited ${n}`);
    }, n)
  );

export function autocomplete(term: string): CancellablePromise<PlaceDetails[]> {
  return task<PlaceDetails[]>(function*() {
    console.log(`⏳ Beginning search for ${term}`);
    yield timeout(500);
    // Begin actual query API call
    let placeResults: PlaceSummary[] = yield fetchPlaceSummaries(term);
    console.log(`✅ Completed search for ${term}`);
    let placeIds = placeResults.map(place => place.place_id);
    let places: PlaceDetails[] = yield fetchPlaceDetails(placeIds);
    console.log(places);
    // Return the results (eventual value of the task)
    return places;
  });
}
