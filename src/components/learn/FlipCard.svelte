<script lang="ts">
let { direction, learnPhrases, onDone } :
 { 
    direction: 'primaryToSecondary' | 'secondaryToPrimary',
    learnPhrases: { primary: string, secondary: string }[],
    onDone: () => void
 } = $props();

 let currentLearnPhraseIndex = $state(0);
 let flipped = $state(false);

 function onGoToNextWord() {
        flipped = false;
		if (currentLearnPhraseIndex === learnPhrases.length - 1) {
			currentLearnPhraseIndex = 0;
			onDone();
		} else {
			currentLearnPhraseIndex++;
		}
	}
</script>

<div class="flip-card">
    <button class="current-word" class:flipped onclick={() => (flipped = !flipped)}>
        {#if (direction === 'primaryToSecondary' && !flipped) || (direction === 'secondaryToPrimary' && flipped)}
            {learnPhrases[currentLearnPhraseIndex].primary}
        {:else}
            {learnPhrases[currentLearnPhraseIndex].secondary}
        {/if}
    </button>
    <button class="next-word" onclick={onGoToNextWord}
        >{currentLearnPhraseIndex === learnPhrases.length - 1 ? 'Abschließen' : 'Weiter'}</button
    >
</div>

<style lang="scss">    
	.flip-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 2rem;
		padding: 0.5rem;
		font-size: 1.5rem;
	}

    button.current-word {
		font-size: 3rem;
		width: 90%;
		height: auto;
		background-color: #faa;

		&.flipped {
			background-color: #aaf;
		}
	}

    button.next-word {
	    margin-top: 1.5rem;
	}
</style>