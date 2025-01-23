import { describe, expect, mock, test } from "bun:test";
import { IpfsUploadResponse } from "../../src/ipfs/types";
import { createIpfsProvider } from "./mocks";

describe("IPFS upload", () => {
  test("Upload a file", async () => {
    const mockedResponse: IpfsUploadResponse = {
      name: "name a",
      cid: "aaa",
      size: 10,
      allocations: [],
    };

    mock.module("axios", () => {
      return {
        default: {
          create: () => {
            return {
              post: (endpoint: string) => {
                if (endpoint === "/add")
                  return Promise.resolve({
                    data: mockedResponse,
                  });
                return Promise.resolve({ data: {} });
              },
            };
          },
        },
      };
    });

    const ipfsProvider = createIpfsProvider();
    const response = await ipfsProvider.upload({} as File);
    expect(response).toEqual(mockedResponse);
  });
});
