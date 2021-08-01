import toChannelInfo from '../toChannelInfo'

describe('toChannelInfo', () => {
  test('properly parses an Emote', () => {
    const channelInfo = {
      data: [
        {
          id: '0',
          name: 'vadiChad',
        },
      ],
    }

    expect(toChannelInfo(channelInfo)).toStrictEqual(channelInfo)
  })

  test('properly throws an Error for missing parameters', () => {
    const valuesToTest = [{}, { data: {} }]

    valuesToTest.forEach((valueToTest) =>
      expect(() => toChannelInfo(valueToTest)).toThrowError(
        'Incorrect or missing parameter: data'
      )
    )
  })
})
