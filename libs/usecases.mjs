import application from './application.mjs';
import { validateBySchema } from './utils/schemaValidation.mjs';
import Response from './utils/Response.mjs';
import { ValidationError, BadRequestError } from './utils/error.mjs';

/**
 * create scope for usecase processing
 * @param req The HTTP IncomingMessage object
 * @returns
 */
export async function createScope(req, withSession = true, addScope = null) {
  return application.createScope(req, withSession, addScope);
}

/**
 * process usecase by name (from appication context)
 * @param context contex from getServerSideProps
 * @param useCaseName
 * @returns
 */
export async function processUsecase(context, useCaseName) {
  const scope = await createScope(context.req);
  const usecase = scope.resolve(useCaseName);
  return processUsecaseInstance(context, usecase);
}

export async function processUsecaseInstance(context, usecase) {
  const request = context.query;
  const props = {
    request,
    response: await usecase.process(request),
    schema: await usecase.schema(request)
  };
  return { props };
}

export async function processUsecaseApi(context, usecaseName) {
  const scope = await createScope(context.req);
  const usecase = scope.resolve(usecaseName);
  return processUsecaseApiInstance(context, usecase);
}

export async function processUsecaseApiInstance(context, usecase) {
  const request = context.query;
  return await usecase.process(request);
}

export async function processUsecaseApiInstance2(context, usecase) {
  const request = context.query;
  const schema = await usecase.schema(request);

  try {
    if (schema) {
      validateBySchema(request, schema);
    }
    const result = await usecase.process(request);
    if (result) {
      let contentType = 'application/json';
      if (typeof data === 'string') {
        contentType = 'text/plain';
      }
      return Response.ok(result, contentType);
    } else {
      return Response.noContent();
    }
  } catch (err) {
    console.log(err);
    const errName = err.constructor.name;
    if (errName == 'BadRequestError' || errName == 'ValidationError') {
      return Response.badRequest(err.message);
    } else {
      return Response.internalError();
    }
  }
}

export const processSchema = async (context, usecaseName) => {
  const scope = await application.createScope(context.req);
  const usecase = scope.resolve(usecaseName);
  return processSchemaInstance(context, usecase);
};

export const processSchemaInstance = async (context, usecase) => {
  const request = context.query;
  const props = {
    request,
    schema: await usecase.schema(request)
  };
  if (usecase.prepare) {
    props.response = await usecase.prepare(request);
  }
  return { props };
};
