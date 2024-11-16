import { writable } from 'svelte/store';
import type { LanguageSettings } from '../types/languageSettings';

export const language = writable<LanguageSettings>({'primary': 'de', 'secondary': 'fr'});