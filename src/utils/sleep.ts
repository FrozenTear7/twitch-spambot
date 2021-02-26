export const sleep = async (time: number) => {
  return new Promise(() => setTimeout(() => {}, time))
}
