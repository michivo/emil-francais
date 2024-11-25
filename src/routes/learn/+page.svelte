<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '../../stores/currentUser';
	import { fromStore } from 'svelte/store';
	import { getPhrases } from '../../services/phrases';
	import type { Phrase } from '../../types/phrase';
	import { areAlike } from '../../helpers/stringHelpers';
	import FlipCard from '../../components/learn/FlipCard.svelte';
	import PhraseInput from '../../components/learn/PhraseInput.svelte';

	let numberOfWords = 0;
	let maxNumberOfWords = 0;
	let mode = 'flipCards' as 'flipCards' | 'typeWords';
	let direction = 'primaryToSecondary' as 'primaryToSecondary' | 'secondaryToPrimary';
	let allPhrases = [] as Phrase[];
	let learnPhrases = [] as Phrase[];
	let currentLearnPhraseIndex = 0;
	let translation = '';
	let correctAnswers = 0;
	let wrongAnswers = 0;
	let currentScreen = 'start' as 'start' | 'flips' | 'type' | 'typePhraseResult' | 'typeEndResult';

	currentUser.subscribe(async (value) => {
		if (value.state === 'loggedIn') {
			await refresh();
		}
	});

	onMount(async () => {
		if (fromStore(currentUser).current.state === 'loggedIn') {
			await refresh();
		}
	});

	async function refresh() {
		allPhrases = await getPhrases();
		maxNumberOfWords = allPhrases.length;
		numberOfWords = maxNumberOfWords > 10 ? 10 : maxNumberOfWords;
	}

	function onStart() {
		currentScreen = mode === 'flipCards' ? 'flips' : 'type';
		const copiedPhrases = [...allPhrases];
		for (let i = 0; i < numberOfWords; i++) {
			const randomIndex = Math.floor(Math.random() * copiedPhrases.length);
			learnPhrases.push(copiedPhrases[randomIndex]);
			copiedPhrases.splice(randomIndex, 1);
		}
	}

	function onCheckTranslation(translationInput: string) {
		translation = translationInput;
		if (
			translation ===
			(direction === 'primaryToSecondary'
				? learnPhrases[currentLearnPhraseIndex].secondary
				: learnPhrases[currentLearnPhraseIndex].primary)
		) {
			correctAnswers++;
		} else {
			wrongAnswers++;
		}
		currentScreen = 'typePhraseResult'
	}

	function onTypeNextWord() {
		translation = '';
		if (currentLearnPhraseIndex === learnPhrases.length - 1) {
			currentLearnPhraseIndex = 0;
			currentScreen = 'typeEndResult';
		} else {
			currentLearnPhraseIndex++;
			currentScreen = 'type';
		}
	}

	function onResultScreenShown() {
		currentScreen = 'start';
	}
</script>

<div class="learn-content">
	{#if currentScreen === 'start'}
		<div class="learn-config">
			<label for="number-of-words">Anzahl der Wörter:</label>
			<input
				id="number-of-words"
				type="number"
				min="1"
				max={maxNumberOfWords}
				bind:value={numberOfWords}
			/>
			<label for="mode-select">Modus:</label>
			<select bind:value={mode} id="mode-select">
				<option value="flipCards">Karten umdrehen</option>
				<option value="typeWords">Wörter tippen</option>
			</select>
			<label for="mode-select">Richtung:</label>
			<select bind:value={direction} id="mode-select">
				<option value="primaryToSecondary">Deutsch -&gt; Französisch</option>
				<option value="secondaryToPrimary">Französisch -&gt; Deutsch</option>
			</select>
			<button class="start-button" on:click={onStart}>Los geht's!</button>
		</div>
	{:else if currentScreen === 'flips'}
		<FlipCard direction={direction} learnPhrases={learnPhrases} onDone={() => currentScreen = 'start'} />
	{:else if currentScreen === 'type'}
		<PhraseInput original={direction === 'primaryToSecondary' ? learnPhrases[currentLearnPhraseIndex].primary : learnPhrases[currentLearnPhraseIndex].secondary }
			onCheckTranslation={onCheckTranslation} />
	{:else if currentScreen === 'typePhraseResult'}
		<div class="step-result">
			{#if translation === (direction === 'primaryToSecondary' ? learnPhrases[currentLearnPhraseIndex].secondary : learnPhrases[currentLearnPhraseIndex].primary)}
				<div class="correct-answer">Richtig! 👌</div>
			{:else if areAlike(translation, direction === 'primaryToSecondary' ? learnPhrases[currentLearnPhraseIndex].secondary : learnPhrases[currentLearnPhraseIndex].primary)}
				<div class="half-answer">Fast... 😣</div>
				<div class="answer-details">
					<div class="label">Richtig:</div>
					<div class="correct-phrase">
						{direction === 'primaryToSecondary'
							? learnPhrases[currentLearnPhraseIndex].secondary
							: learnPhrases[currentLearnPhraseIndex].primary}
					</div>
					<div class="label">Deine Übersetzung:</div>
					<div class="your-translation">{translation}</div>
				</div>
			{:else}
				<div class="wrong-answer">Falsch. 😒</div>
				<div class="answer-details">
					<div class="label">Richtig:</div>
					<div class="correct-phrase">
						{direction === 'primaryToSecondary'
							? learnPhrases[currentLearnPhraseIndex].secondary
							: learnPhrases[currentLearnPhraseIndex].primary}
					</div>
					<div class="label">Deine Übersetzung:</div>
					<div class="your-translation">{translation}</div>
				</div>
			{/if}

			<button class="next-word" on:click={onTypeNextWord}
				>{currentLearnPhraseIndex === learnPhrases.length - 1 ? 'Abschließen' : 'Weiter'}</button
			>
		</div>
	{:else if currentScreen === 'typeEndResult'}
		<div class="total-result">
			<div class="answer-info">Richtig: <span class="count">{correctAnswers}</span></div>
			<div class="answer-info">Falsch: <span class="count">{wrongAnswers}</span></div>
			<button class="next-word" on:click={onResultScreenShown}>Zurück</button>
		</div>
	{/if}
</div>

<style lang="scss">
	.learn-config,

	.translation-form {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		label {
			font-size: 2rem;
		}
	}

	label {
		font-weight: 300;
		color: #333;
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

	button.start-button {
		margin-top: 1rem;
		font-size: 2rem;
	}

	.step-result {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;

		div.label {
			font-weight: 200;
			font-size: 1.8rem;
			font-style: italic;
		}

		.answer-details {
			display: flex;
			flex-direction: column;
			align-items: start;
			justify-content: center;
			gap: 0.5rem;
			width: 85%;
		}

		.correct-answer,
		.wrong-answer,
		.half-answer {
			background-color: #afa;
			font-size: 3rem;
			margin-bottom: 1rem;
			width: 90%;
			border-radius: 1rem;
			text-align: center;
			margin: 1rem;
		}

		.wrong-answer {
			background-color: #faa;
		}

		.half-answer {
			background-color: #ffa;
		}

		.correct-phrase,
		.your-translation {
			font-size: 2rem;
			text-align: left;
		}

		.your-translation {
			color: #333;
		}

		button.next-word {
			margin-top: 1.5rem;
		}
	}

	.total-result {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		
		.answer-info {
			font-size: 2rem;
			font-weight: 300;
			margin-bottom: 1rem;

			.count {
				font-weight: 700;
			}
		}

		button {
				margin-top: 1.5rem;
				width: 100%;
				font-size: 2rem;
		}		
	}
</style>
