type LANG_CODE = string | null;
type TRANSLATIONS = {
  [key: string]: string;
};
type PLACEHOLDERS = {
  [key: string]: string | number;
};
type CONDITION_FUNC = (key: string, placeholders: PLACEHOLDERS) => string;

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
  private defaultLang: LANG_CODE = null;
  private currentLang: LANG_CODE = null;
  private translations: {
    [key: string]: TRANSLATIONS;
  } = {};

  /**
   * Loads initial configuration
   * 
   * @param {*} [options] configuration options
   * @memberof Translate
   */
  public init({ defaultLang, translations }) {
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
  public setDefaultLang(code: string): void {
    this.defaultLang = code;
  }
  
  /**
   * Set current language code
   * 
   * @param {string} [code] language code
   * @memberof Translate
   */
  public setCurrentLang(code: string): void {
    this.currentLang = code;
  }
  
  /**
   * Set language translations
   * 
   * @param {string} [code] language code
   * @param {*} [translations] translations object
   * @memberof Translate
   */
  public setLangTranslations(code: string, translations: TRANSLATIONS): void {
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
  public setLangTranslation(code: string, key: string, translation: string): void {
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
  public getDefaultLang(): LANG_CODE {
    return this.defaultLang;
  }

  /**
   * Get current language code
   * 
   * @returns {string} language code
   * @memberof Translate
   */
  public getCurrentLang(): LANG_CODE {
    return this.currentLang;
  }

  /**
   * Get browser language code
   * 
   * @returns {string | null} language code
   * @memberof Translate
   */
  public getBrowserLang(): LANG_CODE {
    let lang: string;
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
  public getTranslation(key: string, placeholders?: PLACEHOLDERS, condition?: CONDITION_FUNC): string {
    const currentTranslations = this.translations[this.currentLang];
    const translationKey = condition ? condition(key, placeholders) : key;
    let translationString = currentTranslations ? currentTranslations[translationKey] : null;
    
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
  private parsePlaceholders(source: string, placeholders){
    return source.replace(/{\s*\w+\s*}/g, (match) => {
      const key = match.replace(/{|}/g, '').trim();
      return placeholders[key] || match;
    });
  }
}

// exports
export const translate = new Translate();
export const _t: (
  key: string, 
  placeholders?: PLACEHOLDERS, 
  condition?: CONDITION_FUNC
) => string = translate.getTranslation.bind(translate);