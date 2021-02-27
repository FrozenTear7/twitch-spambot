// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { getAllowedEmotes } from '../../../../src/messages/emoteUtils'
// import * as fetchGlobalEmotes from './../../../../src/messages/fetchGlobalEmotes'
// import * as fetchWhitelistedEmotes from './../../../../src/messages/fetchWhitelistedEmotes'

// jest.mock('./../../../../src/messages/fetchGlobalEmotes')
// jest.mock('./../../../../src/messages/fetchWhitelistedEmotes')

// describe('getAllowedEmotes', () => {
//   const emoteArray1 = [1]
//   const emoteArray2 = [2]
//   const emoteArrayCombined = [...emoteArray1, ...emoteArray2]

//   beforeEach(() => {
//     // jest.clearAllMocks()
//     fetchGlobalEmotes.mockReturnValue(Promise.resolve([emoteArray1]))
//     fetchWhitelistedEmotes.mockReturnValue(Promise.resolve([emoteArray2]))
//   })

//   test('merges emotes properly', () => {
//     expect(getAllowedEmotes([])).toBe(emoteArrayCombined)
//   })
// })
