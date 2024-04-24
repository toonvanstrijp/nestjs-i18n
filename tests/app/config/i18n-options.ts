import {I18nJsonLoader, I18nOptions} from "../../../src";
import path from "path";

const i18nOptions: I18nOptions = {
    fallbackLanguage: 'en',
    loaders: [
        new I18nJsonLoader({
            path: path.join(__dirname, '../../i18n')
        })
    ]

}

export {
    i18nOptions
}