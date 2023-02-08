declare type LANG_CODE = string | null;
declare type TRANSLATIONS = {
    [key: string]: string;
};
declare type PLACEHOLDERS = {
    [key: string]: string | number;
};
declare type CONDITION_FUNC = (key: string, placeholders: PLACEHOLDERS) => string;
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
declare class Translate {
    private defaultLang;
    private currentLang;
    private translations;
    /**
     * Loads initial configuration
     *
     * @param {*} [options] configuration options
     * @memberof Translate
     */
    init({ defaultLang, translations }: {
        defaultLang: any;
        translations: any;
    }): void;
    /**
     * Set default language code
     *
     * @param {string} [code] language code
     * @memberof Translate
     */
    setDefaultLang(code: string): void;
    /**
     * Set current language code
     *
     * @param {string} [code] language code
     * @memberof Translate
     */
    setCurrentLang(code: string): void;
    /**
     * Set language translations
     *
     * @param {string} [code] language code
     * @param {*} [translations] translations object
     * @memberof Translate
     */
    setLangTranslations(code: string, translations: TRANSLATIONS): void;
    /**
     * Set language translations
     *
     * @param {string} [code] language code
     * @param {string} [key] translation key
     * @param {string} [translation] translation label
     * @memberof Translate
     */
    setLangTranslation(code: string, key: string, translation: string): void;
    /**
     * Get default language code
     *
     * @returns {string} language code
     * @memberof Translate
     */
    getDefaultLang(): LANG_CODE;
    /**
     * Get current language code
     *
     * @returns {string} language code
     * @memberof Translate
     */
    getCurrentLang(): LANG_CODE;
    /**
     * Get browser language code
     *
     * @returns {string | null} language code
     * @memberof Translate
     */
    getBrowserLang(): LANG_CODE;
    /**
     * Get translation
     *
     * @param {string} [key] translation key
     * @returns {string} translation label
     * @memberof Translate
     */
    getTranslation(key: string, placeholders?: PLACEHOLDERS, condition?: CONDITION_FUNC): string;
    /**
     * Parse translation label placeholders
     *
     * @param {string} [source] translation label
     * @param {*} [placeholders] placeholders object
     * @returns {string} parsed translation label
     * @memberof Translate
     */
    private parsePlaceholders;
}
export declare const translate: Translate;
export declare const _t: (key: string, placeholders?: PLACEHOLDERS, condition?: CONDITION_FUNC) => string;
export {};
