import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

/**
 * Registers the /say-hello POST route on the provided Fastify instance.
 *
 * @param app - The Fastify instance to register the route on.
 * @remarks
 * Expects a JSON body with a `name` property and responds with a JSON message.
 */
export async function sayHello(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/say-hello",
    {
      schema: {
        tags: ["say-hello"],
        summary: "Say hello",
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      return reply.status(201).send({ message: `Hello ${name}` });
    },
  );
}
