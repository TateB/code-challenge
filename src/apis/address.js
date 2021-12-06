import { isAddress } from "@ethersproject/address";
import { providers } from "ethers";

const provider = new providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/4a83e8fd4f744b1c8cc26dad2b4d2660"
);

export async function validateAddrInput(input) {
  if (input === "") return;
  const type = input.startsWith("0x") ? "address" : "name";
  const name = await getAddrOrName(type, input);
  if (name === "No ENS Name" || !name) return { address: input };
  const resolver = await tryGetResolver(name);
  if (!resolver) {
    const resolvedName = await provider.resolveName(name);
    if (resolvedName)
      throw new Error("No wallet has it's primary name set to this ENS Name.");
    throw new Error("This ENS Name does not exist.");
  }
  const warning =
    (await isContract(name)) &&
    "This is a contract address, please double check the address.";
  const address = resolver.address;
  if (type === "address" && address !== input)
    return { address: input, warning };
  if (
    type === "name" &&
    address === "0x0000000000000000000000000000000000000000"
  )
    throw new Error(
      "There is no Ethereum address associated with this ENS Name."
    );
  const avatar = await resolver.getAvatar();
  return { address, name, avatar, warning };
}

async function getAddrOrName(type, input) {
  try {
    if (type === "name") return input;
    const returnName =
      type === "address" ? await provider.lookupAddress(input) : input;
    return returnName;
  } catch {
    console.log("Catching");
    if (isAddress(input)) return "No ENS Name";
    throw new Error("That is not a valid Ethereum address.");
  }
}

async function isContract(address) {
  const code = await provider.getCode(address);
  console.log(code);
  return code !== "0x";
}

async function tryGetResolver(name) {
  return provider.getResolver(name).catch(() => null);
}
