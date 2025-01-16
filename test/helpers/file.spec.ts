import { describe, expect, mock, test } from "bun:test";
import { isFileImage } from "../../src/helpers/file";

describe("file", () => {
  describe("isFileImage ", () => {
    const testCases: [mime: string, expected: boolean][] = [
      ["image/png", true],
      ["image/jpeg", true],
      ["image/gif", true],
      ["application/pdf", false],
      ["text/plain", false],
    ];

    test.each(testCases)(
      "If file mime is %p, isFileImage should return %p",
      async (mime, expected) => {
        mock.module("file-type", () => {
          return {
            fileTypeFromBlob: () => Promise.resolve({ mime }),
          };
        });

        expect(await isFileImage({} as File)).toBe(expected);
      }
    );
  });
});
