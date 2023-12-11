"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._t = exports.translate = void 0;
/**
 * class for translations
 *
 * class implementation example:
 * ```ts
 * import { translate, _t } from '@n7-frontend/core';
 *
 * ...
 * translate.init({
 *   defaultLang: 'it',
 *   translations: {
 *     it: {
 *       hello: 'mondo',
 *       say: 'ciao {name}'
 *     },
 *     en: {
 *       hello: 'world',
 *       say: 'hi {name}'
 *     },
 *     es: {
 *       hello: 'mundo',
 *       say: 'hola {name}'
 *     }
 *   }
 * })
 * ...
 *
 * console.log(_t('hello'));
 * console.log(_t('say', { name: 'John Doe' }));
 * ```
 *
 * @class Translate
 */
class Translate {
    constructor() {
        this.defaultLang = null;
        this.currentLang = null;
        this.translations = {};
    }
    /**
     * Loads initial configuration
     *
     * @param {*} [options] configuration options
     * @memberof Translate
     */
    init({ defaultLang, translations }) {
        if (defaultLang) {
            this.setDefaultLang(defaultLang);
        }
        if (translations) {
            Object.keys(translations).forEach((code) => {
                this.setLangTranslations(code, translations[code]);
            });
        }
    }
    /**
     * Set default language code
     *
     * @param {string} [code] language code
     * @memberof Translate
     */
    setDefaultLang(code) {
        this.defaultLang = code;
    }
    /**
     * Set current language code
     *
     * @param {string} [code] language code
     * @memberof Translate
     */
    setCurrentLang(code) {
        this.currentLang = code;
    }
    /**
     * Set language translations
     *
     * @param {string} [code] language code
     * @param {*} [translations] translations object
     * @memberof Translate
     */
    setLangTranslations(code, translations) {
        if (this.translations[code]) {
            throw Error(`Translations for lang ${code} already exists`);
        }
        this.translations[code] = translations;
    }
    /**
     * Set language translations
     *
     * @param {string} [code] language code
     * @param {string} [key] translation key
     * @param {string} [translation] translation label
     * @memberof Translate
     */
    setLangTranslation(code, key, translation) {
        if (!this.translations[code]) {
            this.translations[code] = {};
        }
        this.translations[code][key] = translation;
    }
    /**
     * Get default language code
     *
     * @returns {string} language code
     * @memberof Translate
     */
    getDefaultLang() {
        return this.defaultLang;
    }
    /**
     * Get current language code
     *
     * @returns {string} language code
     * @memberof Translate
     */
    getCurrentLang() {
        return this.currentLang;
    }
    /**
     * Get browser language code
     *
     * @returns {string | null} language code
     * @memberof Translate
     */
    getBrowserLang() {
        let lang;
        if (typeof navigator !== 'undefined') {
            if (navigator.languages) {
                lang = navigator.languages[0];
            }
            if (navigator['userLanguage']) {
                lang = navigator['userLanguage'];
            }
            if (navigator.language) {
                lang = navigator.language;
            }
        }
        return lang || null;
    }
    /**
     * Get translation
     *
     * @param {string} [key] translation key
     * @returns {string} translation label
     * @memberof Translate
     */
    getTranslation(key, placeholders, condition) {
        const currentTranslations = this.translations[this.currentLang];
        const translationKey = condition ? condition(key, placeholders) : key;
        let translationString = currentTranslations
            ? currentTranslations[translationKey]
            : null;
        // no translation use default
        if (!translationString) {
            const defaultTranslations = this.translations[this.defaultLang];
            translationString = defaultTranslations[translationKey] || translationKey;
        }
        if (placeholders) {
            translationString = this.parsePlaceholders(translationString, placeholders);
        }
        return translationString;
    }
    /**
     * Parse translation label placeholders
     *
     * @param {string} [source] translation label
     * @param {*} [placeholders] placeholders object
     * @returns {string} parsed translation label
     * @memberof Translate
     */
    parsePlaceholders(source, placeholders) {
        return source.replace(/{\s*\w+\s*}/g, (match) => {
            const key = match.replace(/{|}/g, '').trim();
            return placeholders[key] || match;
        });
    }
}
// exports
exports.translate = new Translate();
exports._t = exports.translate.getTranslation.bind(exports.translate);
