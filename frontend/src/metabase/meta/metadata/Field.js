/* @flow */

import Base from "./Base";
import Table from "./Table";

import type { FieldId, Field as FieldObject } from "metabase/meta/types/Field";
import type { TableId } from "metabase/meta/types/Table";

import { isDate, isNumeric, isBoolean, isString, isSummable, isCategory, isDimension, isMetric, getIconForField } from "metabase/lib/schema_metadata";
import { isPK, isFK } from "metabase/lib/types";

export default class Field extends Base {
    static type = "fields";
    static schema = {};

    _object: FieldObject;

    id: FieldId;
    display_name: string;
    table_id: TableId;
    fk_target_field_id: FieldId;

    base_type: string;
    special_type: string;

    table(): Table {
        const table = this._entity(Table, this.table_id);
        if (table == null) {
            throw new Error("Couldn't get the table for this field");
        }
        return table;
    }

    target() {
        return this._entity(Field, this.fk_target_field_id);
    }

    isDate()      { return isDate(this._object); }
    isNumeric()   { return isNumeric(this._object); }
    isBoolean()   { return isBoolean(this._object); }
    isString()    { return isString(this._object); }
    isSummable()  { return isSummable(this._object); }
    isCategory()  { return isCategory(this._object); }
    isMetric()    { return isMetric(this._object); }
    isDimension() { return isDimension(this._object); }
    isID()        { return isPK(this.special_type) || isFK(this.special_type); }
    isPK()        { return isPK(this.special_type); }
    isFK()        { return isFK(this.special_type); }

    values(): Array<string> {
        let values = this._object.values;
        // https://github.com/metabase/metabase/issues/3417
        if (Array.isArray(values)) {
            return values;
        } else if (values && Array.isArray(values.values)) {
            return values.values;
        } else {
            return [];
        }
    }

    icon() {
        return getIconForField(this._object);
    }
}
