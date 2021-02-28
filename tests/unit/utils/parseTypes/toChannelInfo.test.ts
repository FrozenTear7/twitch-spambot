import toChannelInfo from '../../../../src/utils/parseTypes/toChannelInfo'

describe('toChannelInfo', () => {
  test('properly parses an Emote', () => {
    const channelInfo = {
      emotes: [
        {
          code: 'test',
          emoticon_set: 0,
          id: 0,
        },
      ],
    }

    expect(toChannelInfo(channelInfo)).toStrictEqual(channelInfo)
  })

  test('properly throws an Error for missing parameters', () => {
    const valuesToTest = [{}, { emotes: {} }]

    valuesToTest.forEach((valueToTest) =>
      expect(() => toChannelInfo(valueToTest)).toThrowError(
        'Incorrect or missing parameter: emotes'
      )
    )
  })
})
