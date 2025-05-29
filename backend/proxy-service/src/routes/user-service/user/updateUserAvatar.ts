import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { services } from "../../../config";
import { Axios, AxiosRequestConfig } from "axios";
import FormData from "form-data";

export default async function updateUserAvatarRoute(app: FastifyInstance) {
  app.put<{ Params: { id: string } }>(
    "/user-service/users/:id/avatar",
    async (request, reply) => {
      const file = await (request as any).file();
      if (!file)
        return reply.sendError({ statusCode: 400, message: "No file field" });

      const formData = new FormData();
      formData.append("file", file.file, {
        filename: file.filename,
        contentType: file.mimetype,
      });

      await userServiceRequestHandler(app, request, reply, {
        method: "PUT",
        url: `${services.userService}/users/${request.params.id}/avatar`,
        data: formData,
        headers: formData.getHeaders(),
      } as AxiosRequestConfig);
    }
  );
}
