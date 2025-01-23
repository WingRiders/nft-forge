import { describe, expect, mock, test } from "bun:test";
import { IpfsPin } from "../../src/ipfs/types";
import { createIpfsProvider } from "./mocks";

describe("IPFS pins", () => {
  test("Get all pins", async () => {
    const mockedPins: IpfsPin[] = [
      {
        cid: "cid a",
        name: "name a",
        allocations: [],
        origins: [],
        created: "created a",
        metadata: {},
        peer_map: {},
      },
      {
        cid: "cid b",
        name: "name b",
        allocations: [],
        origins: [],
        created: "created b",
        metadata: {},
        peer_map: {},
      },
      {
        cid: "cid c",
        name: "name c",
        allocations: [],
        origins: [],
        created: "created c",
        metadata: {},
        peer_map: {},
      },
    ];

    mock.module("axios", () => {
      return {
        default: {
          create: () => {
            return {
              get: (endpoint: string) => {
                if (endpoint === "/pins")
                  return Promise.resolve({
                    data:
                      mockedPins.map((pin) => JSON.stringify(pin)).join("\n") +
                      "\n",
                  });
                return Promise.resolve({ data: {} });
              },
            };
          },
        },
      };
    });

    const ipfsProvider = createIpfsProvider();
    const pins = await ipfsProvider.pins();
    expect(pins).toEqual(mockedPins);
  });
});
