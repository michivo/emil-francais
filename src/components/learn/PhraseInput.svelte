<script lang="ts">
    let { original, onCheckTranslation } :
    { original: string, onCheckTranslation: (input: string) => void } = $props();

    let translation = $state('');

</script>

<div class="phrase-input">
    <div class="original-phrase">
        <div class="label">Übersetze:</div>
        { original }
    </div>
    <form class="translation-form">
        <label for="translation">Übersetzung:</label>
        <input
            id="translation"
            type="text"
            bind:value={translation}
            autofocus
        />
        <button type="submit" class="check-translation" onclick={() => onCheckTranslation(translation)}
            >Überprüfen</button
        >
    </form>
</div>

<style lang="scss">
    .phrase-input {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
		padding: 1rem;

		input {
			font-size: 1.7rem;
			font-weight: 300;
			border-radius: 0.5rem;
			width: 100%;
		}

		select {
			font-size: 1.5rem;
			background-color: white;
			font-weight: 300;
			border-radius: 0.5rem;
		}

		.original-phrase {
			font-size: 2rem;
			font-weight: 700;

			.label {
				font-weight: 300;
			}
		}
	}

	.translation-form {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		label {
			font-size: 2rem;
		}
	}   
    
	button.check-translation {
		font-size: 1.5rem;
		margin-top: 2rem;
		width: 100%;
	}    
</style>