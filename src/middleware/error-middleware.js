import { JoiError } from '../error/joi-error.js';
import { ResponseError } from '../error/response-error.js';

export const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err?.type == 'entity.parse.failed' && err?.body) {
    const error = { message: `Invalid body request`, body: err?.body, path: ['body request'] };
    return res.status(400).json({
      success: false,
      errors: [error],
    });
  } else if (err instanceof ResponseError) {
    const error = { message: err.message };
    if (err?.path) {
      error.path = err.path;
    }
    return res.status(err.status).json({
      success: false,
      errors: [error],
    });
  } else if (err instanceof JoiError) {
    return res.status(400).json({
      success: false,
      errors: JSON.parse(err.message),
    });
  } else {
    return res.status(500).json({
      success: false,
      errors: [
        {
          message: 'Internal server error',
        },
        err,
      ],
    });
  }
};
