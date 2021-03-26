import { Result, ValidationError } from 'express-validator'


export class ServerError extends Error {
  status = 500

  constructor(message = 'Internal Error') {
    super(message)
  }
}

export class NotFound extends ServerError {
  status = 404

  constructor(message = 'Not Found') {
    super(message)
  }
}

export class DuplicateResource extends ServerError {
  status = 409

  constructor(message = 'Duplicate Resource') {
    super(message)
  }
}

export class InvalidRequest extends ServerError {
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
