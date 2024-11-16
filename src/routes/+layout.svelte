<script lang="ts">
	import { currentUser } from '../stores/currentUser';
	import LoggedInHeader from '../components/headers/LoggedInHeader.svelte';
	import EmptyHeader from '../components/headers/EmptyHeader.svelte';
	import LoadingHeader from '../components/headers/LoadingHeader.svelte';
</script>

<div class="container">
    {#if $currentUser.state === 'loggedIn'}
        <LoggedInHeader />
    {:else if $currentUser.state === 'loggedOut'}
         <EmptyHeader />
    {:else}
        <LoadingHeader />
    {/if}
    <main>
        <slot></slot>
    </main>
</div>

<style lang="scss">
    .container {
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
</style>