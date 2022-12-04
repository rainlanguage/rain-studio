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
 * NOTE: It will be reset after sign out.
 */
export const isLinked = writable(false);

/**
 * Flag that represent if the current address connected is linked to ANOTHER user.
 * NOTE: It will be reset after sign out.
 */
export const isLinkedToOther = writable(false);

/**
 * Array that contain all the not desired addresses to link on this session.
 * NOTE: It will be reset after sign out.
 */
export const unwantedWallets: Writable<string[]> = writable([]);

export const linkedWalllets: Writable<string[]> = writable([]);
