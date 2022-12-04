import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export enum SearchStatus {
	NotStarted,
	Searching,
	Finished
}

/**
 * Flag that represent the current status of the search address.
 * NOTE: It will be reset after sign out.
 */
export const currentSearchStatus = writable(SearchStatus.NotStarted);

/**
 * Flag that represent if the current address connected is linked to the current user.
 */
export const isLinked = writable(false);

/**
 * Array that contain all the not desired addresses to link on this session.
 * NOTE: It will be reset after sign out.
 */
export const unwantedWallets: Writable<string[]> = writable(['']);
