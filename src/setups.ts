export async function Setups() {
  try {
  } catch (error: any) {
    const e: Error = new Error(error.message);
    e.name = error.code;
    e.stack = error.stack;
    throw e;
  }
}
