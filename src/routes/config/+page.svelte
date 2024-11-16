<script lang="ts">
	import { currentUser } from '../../stores/currentUser';
	import Spinner from '../../components/misc/Spinner.svelte';
	import { onMount } from 'svelte';
	import { addPhrase, deletePhrase, getPhrases, updatePhrase } from '../../services/phrases';
	import type { Phrase } from '../../types/phrase';
	import { fromStore } from 'svelte/store';
	import EditIcon from '../../components/icons/EditIcon.svelte';
	import TranslateIcon from '../../components/icons/TranslateIcon.svelte';
	import DeleteIcon from '../../components/icons/DeleteIcon.svelte';

	let phrases = [] as Phrase[];
	let addDialogOpen = false;
	let processing = false;

	let currentPhrase = { primary: '', secondary: '' } as Phrase;

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
		phrases = await getPhrases(true);
	}

	function onOpenAddDialog() {
		addDialogOpen = true;
		currentPhrase = {
			primary: '',
			secondary: '',
			active: true
		};
	}

	async function onAddOrEditPhrase() {
		processing = true;
		try {
			if (!currentPhrase.id) {
				await addPhrase(currentPhrase);
			} else {
				await updatePhrase(currentPhrase);
			}
			await refresh();
			addDialogOpen = false;
		} finally {
			processing = false;
		}
	}

	function onCancel() {
		addDialogOpen = false;
		currentPhrase = {
			primary: '',
			secondary: '',
			active: true
		};
	}

	function onEditPhrase(phrase: Phrase) {
		currentPhrase = phrase;
		addDialogOpen = true;
	}

	async function onTranslate() {
		processing = true;
		try {
			const response = await fetch(
				`https://api.mymemory.translated.net/get?q=${currentPhrase.primary}&langpair=de|fr`
			);
			const data = await response.json();
			currentPhrase.secondary = data.responseData.translatedText;
		} finally {
			processing = false;
		}
	}

	async function onDeletePhrase(phrase: Phrase) {
		processing = true;
		try {
			await deletePhrase(phrase);
			await refresh();
		} finally {
			processing = false;
		}
	}
</script>

{#if $currentUser.state === 'loggedIn'}
	<div class="word-list" class:faded={addDialogOpen}>
		<div class="word-table">
			<table>
				<thead>
					<tr>
						<th>Deutsch</th>
						<th>Französisch</th>
						<th>Aktionen</th>
					</tr>
				</thead>
				<tbody>
					{#each phrases as phrase}
						<tr>
							<td class:inactive={!phrase.active}>{phrase.primary}</td>
							<td class:inactive={!phrase.active}>{phrase.secondary}</td>
							<td>
								<div class="action-buttons">
									<button on:click={() => onEditPhrase(phrase)}><EditIcon /></button>
									<button on:click={() => onDeletePhrase(phrase)}><DeleteIcon /></button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<button on:click={onOpenAddDialog} class="add-button">+ Hinzufügen</button>
	</div>
	{#if addDialogOpen}
		<dialog open={addDialogOpen}>
			<div class="input-group">
				<label for="primary">Deutsch</label>
				<input disabled={processing} id="primary" bind:value={currentPhrase.primary} />
			</div>
			<button on:click={onTranslate} disabled={!currentPhrase.primary} class="translate"
				><TranslateIcon /></button
			>
			<div class="input-group">
				<label for="secondary">Französisch</label>
				<input disabled={processing} id="secondary" bind:value={currentPhrase.secondary} />
			</div>
			<div class="input-group">
				<label for="is-active">Aktiv</label>
				<input
					type="checkbox"
					disabled={processing}
					id="is-active"
					bind:checked={currentPhrase.active}
				/>
				<form method="dialog">
					<button on:click={onCancel} disabled={processing}>Abbrechen</button>
					<button
						on:click={onAddOrEditPhrase}
						disabled={!currentPhrase.primary || !currentPhrase.secondary || processing}>OK</button
					>
				</form>
			</div>
		</dialog>
	{/if}
{:else if $currentUser.state === 'pending'}
	<Spinner />
{:else}
	<div>Sie haben keine Berechtigung, auf diese Seite zuzugreifen.</div>
{/if}

<style lang="scss">
	.word-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding-top: 1rem;
		flex: 1;
	}

	.word-table {
		flex: 1;
	}

	table {
		width: 100%;
		border-bottom: 1px dotted black;

		td {
			text-align: center;
			padding: 0.5rem;
			font-weight: 300;

			&.inactive {
				color: #888;
			}

			.action-buttons {
				display: flex;
				flex-direction: row;

				button {
					padding: 0;
					border: none;

					:global(svg) {
						width: 2rem;
						height: 2rem;
					}
				}
			}
		}
	}

	.add-button {
		width: 90%;
		height: 3rem;
		margin-bottom: 0.5rem;
		position: sticky;
		bottom: 0.25rem;
	}

	.faded {
		opacity: 0.5;
	}

	dialog {
		position: fixed;
		top: 30%;
		left: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid black;
		border-radius: 0.5rem;

		.input-group {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			input {
				font-size: 1.5rem;
				height: 2rem;
				border-radius: 0.25rem;
			}
		}

		form {
			display: flex;
			justify-content: space-between;
		}
	}

	button.translate {
		padding: 0.125rem;

		&:disabled {
			opacity: 0.5;
		}

		:global(svg) {
			width: 2.25rem;
			height: 2.25rem;
		}
	}
</style>
