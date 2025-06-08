'use strict'
import { StatusCode } from '../utils/statusCodes.js'
import { ReasonStatusCode } from '../utils/reasonPhrases.js'

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

export class ConflicRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode)
    }
}

export class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}