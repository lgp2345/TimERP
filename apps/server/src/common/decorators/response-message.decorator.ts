import { SetMetadata } from "@nestjs/common";

export const RESPONSE_MESSAGE_METADATA_KEY = "response_message";

/**
 * Sets a custom success message for unified response wrapping.
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA_KEY, message);
