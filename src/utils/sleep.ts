export const sleep = async (time: number): Promise<unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new Promise(() => setTimeout(() => {}, time))
}
