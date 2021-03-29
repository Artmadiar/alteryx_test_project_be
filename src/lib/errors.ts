import { Result, ValidationError } from 'express-validator'


/**
  @apiDefine InternalError
  @apiError (Error 500) InternalError
  @apiGroup 5xx
  */
export class InternalError extends Error {
  status = 500

  constructor(message = 'Internal Error') {
    super(message)
  }
}

/**
  @apiDefine NotFoundError
  @apiError (Error 404) NotFoundError
  @apiGroup 4xx
  */
  export class NotFoundError extends InternalError {
  status = 404

  constructor(message = 'Not Found') {
    super(message)
  }
}

/**
  @apiDefine DuplicateResourceError
  @apiError (Error 409) DuplicateResourceError
  @apiGroup 4xx
  */
  export class DuplicateResourceError extends InternalError {
  status = 409

  constructor(message = 'Duplicate Resource') {
    super(message)
  }
}

/**
  @apiDefine UnauthorizedError
  @apiError (Error 403) UnauthorizedError
  @apiGroup 4xx
  */
  export class UnauthorizedError extends InternalError {
  status = 403

  constructor(message = 'UnauthorizedError') {
    super(message)
  }
}

/**
  @apiDefine InvalidRequestError
  @apiError (Error 400) InvalidRequestError
  @apiGroup 4xx
  */
  export class InvalidRequestError extends InternalError {
  status = 400

  constructor(validation?: Result<ValidationError>) {
    super('Invalid Request')

    if (validation) {
      // show only first validation error
      const errors: ValidationError = validation.array()[0]
      this.message = errors.msg;
    }
  }
}
