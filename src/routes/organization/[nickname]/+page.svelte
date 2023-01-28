<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<p>
	Organization name: {data.orgData.name}
</p>
<p>
	Organization nickname: {data.orgData.nickname}
</p>
