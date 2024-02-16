export default class Event {
  name: string = "";
  once: boolean = false;

  execute(..._args: unknown[]) {
    throw new Error("Unsupported operation.");
  }
}