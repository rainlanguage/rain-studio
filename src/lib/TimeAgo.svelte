<script lang="ts">
	import TimeAgo from 'javascript-time-ago';

	// English.

	export let dateString: string = '';
	export let date: Date | null = null;

	// Create formatter (English).
	const timeAgo = new TimeAgo('en-US');

	const formatted = timeAgo.format(date || new Date(dateString));
</script>

<span class="text-sm text-gray-500">
	{formatted}
</span>
