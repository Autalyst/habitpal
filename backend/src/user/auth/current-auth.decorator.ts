import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (property: string, executionContext: ExecutionContext) => {
        const context = executionContext.getArgByIndex(1);
        return property ? context.req.userId && context.req.userId[property] : context.req.userId;
    },
);