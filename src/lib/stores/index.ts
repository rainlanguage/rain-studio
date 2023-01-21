import { writable } from 'svelte/store';
import { SearchStatus } from '$lib/connected-table';
import type { Writable } from 'svelte/store';

/**
 * Save if an address that was already use to find a match (the latest address used)
 */
export const alreadySearched: Writable<string> = writable();

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

/**
 * Array that contain all the linked wallets by the current user
 */
export const linkedWalllets: Writable<string[]> = writable([]);
