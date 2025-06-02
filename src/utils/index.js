'use strict'

import lodash from 'lodash'

export default function getInfoData({ fields = [], object = [] }) {
    return lodash.pick(object, fields)
} 