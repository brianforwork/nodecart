'use strict'

import lodash from 'lodash'

export function getInfoData({ fields = [], object = [] }) {
    return lodash.pick(object, fields)
} 

export function getSelectData(select = []) {
    return Object.fromEntries(select.map(el => [el, 1]))
}