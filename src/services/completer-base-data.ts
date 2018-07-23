import { Subject } from 'rxjs/Subject';

import { CompleterItem } from '../components/completer-item';
import { CompleterData } from './completer-data';
import { isNil } from '../globals';

export abstract class CompleterBaseData extends Subject<CompleterItem[] | null> implements CompleterData {


    protected _searchFields: string | null;
    protected _titleField: string | null;
    protected _descriptionField: string;
    protected _imageField: string;

    constructor() {
        super();
    }

    public abstract search(term: string): void;

    public cancel() {
        return;
    }

    public searchFields(searchFields: string | null) {
        this._searchFields = searchFields;
        return this;
    }

    public titleField(titleField: string | null) {
        this._titleField = titleField;
        return this;
    }

    public descriptionField(descriptionField: string) {
        this._descriptionField = descriptionField;
        return this;
    }

    public imageField(imageField: string) {
        this._imageField = imageField;
        return this;
    }

    public convertToItem(data: any) {
        let image: string | null = null;
        let formattedText: string;
        let formattedDesc: string | null = null;

        if (this._titleField) {
            formattedText = this.extractTitle(data);
        } else {
            formattedText = data;
        }

        if (typeof formattedText !== "string") {
            formattedText = JSON.stringify(formattedText);
        }

        if (this._descriptionField) {
            formattedDesc = this.extractValue(data, this._descriptionField);
        }

        if (this._imageField) {
            image = this.extractValue(data, this._imageField);
        }

        if (isNil(formattedText)) {
            return null;
        }

        return {
            description: formattedDesc,
            image,
            originalObject: data,
            title: formattedText
        } as CompleterItem;

    }

    protected extractMatches(data: any[], term: string) {
        let matches: any[] = [];
        const searchFields = this._searchFields ? this._searchFields.split(",") : null;
        if (this._searchFields !== null && this._searchFields !== undefined && term !== "") {
            matches = data.filter((item) => {
                const values: any[] = searchFields ? this.extractBySearchFields(searchFields, item) : [item];
                return values.some((value) => value
                    .toString()
                    .toLowerCase()
                    .indexOf(term.toString().toLowerCase()) >= 0
                );
            });
        } else {
            matches = data;
        }

        return matches;
    }

    protected extractTitle(item: any) {
        // split title fields and run extractValue for each and join with ' '
        if (!this._titleField) {
            return "";
        }

        return this._titleField.split(",")
            .map((field) => {
                return this.extractValue(item, field);
            })
            .reduce((acc, titlePart) => acc ? `${acc} ${titlePart}` : titlePart);
    }

    protected extractValue(obj: any, key: string | null) {
        let keys: string[];
        let result: any;
        if (key) {
            keys = key.split(".");
            result = obj;
            for (key of keys) {
                if (result) {
                    result = result[key];
                }
            }
        } else {
            result = obj;
        }
        return result;
    }

    protected processResults(matches: string[]): CompleterItem[] {
        let i: number;
        const results: CompleterItem[] = [];

        if (matches && matches.length > 0) {
            for (i = 0; i < matches.length; i++) {
                const item = this.convertToItem(matches[i]);
                if (item) {
                    results.push(item);
                }
            }
        }
        return results;
    }

    private extractBySearchFields(searchFields: string[], item: any) {
        return searchFields
            .map((searchField) => this.extractValue(item, searchField)).filter((value) => !!value);
    }
}